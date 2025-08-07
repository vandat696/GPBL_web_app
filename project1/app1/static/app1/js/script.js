document.addEventListener('DOMContentLoaded', () => {

  // --- Cấu hình API và CSRF Token ---
  // Lấy CSRF token từ thẻ meta hoặc input trong form của Django
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  // --- Xử lý sự kiện chuyển trang và thanh điều hướng ---
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      const pageId = item.dataset.page;
      pages.forEach(page => page.classList.remove('active'));
      document.getElementById(`${pageId}-page`).classList.add('active');
    });
  });

  // --- Xử lý slideshow trên trang chủ ---
  const slideshowImages = [
    "https://abvietnamtravel.com/img/logo/75B82SV64B_408255330_739691568182256_1104935954509976190_n.jpg",
    "https://iweb.tatthanh.com.vn/pic/3231/imagegallery/Album-Nhat-Ban.jpg",
    "https://tranbathoaimdphd.wordpress.com/wp-content/uploads/2018/12/1-new-york_1.jpg",
    "https://datviettour.com.vn/uploads/images/chau-au/phap/d"
  ];
  let currentSlide = 0;
  const slideshowElements = document.querySelectorAll('.slideshow-image');

  function showSlide() {
    slideshowElements.forEach(el => el.classList.remove('active'));
    slideshowElements[currentSlide].style.backgroundImage = `url('${slideshowImages[currentSlide]}')`;
    slideshowElements[currentSlide].classList.add('active');
    currentSlide = (currentSlide + 1) % slideshowImages.length;
  }

  showSlide();
  setInterval(showSlide, 3000);

  // --- Xử lý Modal chi tiết bài viết ---
  const postModal = document.getElementById('post-modal');
  const closeButton = document.getElementById('close-button');
  const postDetailContent = document.getElementById('post-detail-content');

  // Lắng nghe sự kiện click trên các thẻ bài viết
  document.addEventListener('click', async (e) => {
    const postCard = e.target.closest('.post-card');
    if (postCard) {
      const postId = postCard.dataset.id;
      // Hiển thị modal và loading
      postModal.style.display = 'block';
      postDetailContent.innerHTML = '<div class="loader">Loading...</div>';

      try {
        // Gửi yêu cầu GET đến API backend để lấy chi tiết bài viết
        // Giả sử API endpoint là /api/posts/<id>/
        const response = await fetch(`/api/posts/${postId}/`);
        if (!response.ok) {
          throw new Error('Không thể tải chi tiết bài viết.');
        }
        const data = await response.json();
        
        // Cập nhật nội dung modal với dữ liệu từ backend
        postDetailContent.innerHTML = `
          <div class="post-detail-header">
            <h3>${data.title}</h3>
            <div class="post-meta">
                <span class="post-country">${data.country}</span>
                <span class="post-author">${data.author.username}</span>
            </div>
          </div>
          <div class="post-detail-body">
            ${data.picture_url ? `<img src="${data.picture_url}" alt="${data.title}">` : ''}
            <p>${data.body}</p>
          </div>
          <div class="post-detail-footer">
            <div class="post-stats">
              <span><i class="fa-solid fa-thumbs-up"></i> ${data.likes_count}</span>
              <span><i class="fa-solid fa-thumbs-down"></i> ${data.dislikes_count}</span>
              <span><i class="fa-solid fa-comment"></i> ${data.comments_count}</span>
            </div>
            <div class="comments-section">
              <h3>コメント</h3>
              <div id="comments-list">
                ${data.comments.map(c => `<div class="comment"><strong>${c.author}:</strong> ${c.text}</div>`).join('')}
              </div>
            </div>
          </div>
        `;

      } catch (error) {
        console.error('Lỗi khi tải chi tiết bài viết:', error);
        postDetailContent.innerHTML = '<p>Không thể tải nội dung bài viết. Vui lòng thử lại sau.</p>';
      }
    }
  });
  
  closeButton.addEventListener('click', () => {
    postModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === postModal) {
      postModal.style.display = 'none';
    }
  });

  // --- Xử lý Modal đăng bài mới ---
  const newPostModal = document.getElementById('new-post-modal');
  const postButton = document.getElementById('post-button');
  const closeNewPostModal = document.getElementById('close-new-post-modal');
  const newPostForm = document.getElementById('new-post-form');

  postButton.addEventListener('click', () => {
    newPostModal.style.display = 'block';
  });
  
  closeNewPostModal.addEventListener('click', () => {
    newPostModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === newPostModal) {
      newPostModal.style.display = 'none';
    }
  });

  // --- Xử lý form đăng bài mới và gửi đến backend ---
  newPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(newPostForm);

    try {
      // Gửi request POST đến API backend của Django
      // Giả sử API endpoint là /api/posts/create/
      const response = await fetch('/api/posts/create/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrftoken,
        },
        body: formData,
      });

      if (response.ok) {
        const newPost = await response.json();
        alert('Bài viết đã được đăng thành công!'); // Thay bằng modal tùy chỉnh
        newPostModal.style.display = 'none';
        newPostForm.reset();
        // Có thể làm mới trang để hiển thị bài viết mới
        window.location.reload(); 
      } else {
        const errorData = await response.json();
        console.error('Lỗi khi đăng bài:', errorData);
        alert('Có lỗi xảy ra khi đăng bài: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Lỗi mạng:', error);
      alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
    }
  });

});
