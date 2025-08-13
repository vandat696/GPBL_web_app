document.addEventListener('DOMContentLoaded', () => {
    const tags = document.querySelectorAll('.tag');

    // Đọc các tag đã chọn từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedTags = urlParams.getAll('tag');

    // Gắn class active cho tag đã chọn khi load lại trang
    tags.forEach(tag => {
        const href = tag.getAttribute('href');
        const tagIdMatch = href.match(/tag=(\d+)/);
        if (tagIdMatch && selectedTags.includes(tagIdMatch[1])) {
            tag.classList.add('active');
        }
    });
  // --- API và CSRF Token ---
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const csrftoken = getCookie('csrftoken');

  // --- Slideshow trên trang chủ (có hiệu ứng fade) ---
  const slideshowImages = document.querySelectorAll('.slideshow-image');
  let currentImageIndex = 0;

  if (slideshowImages.length > 0) {
    slideshowImages[currentImageIndex].classList.add('active');
    
    function updateSlideshow() {
      slideshowImages[currentImageIndex].classList.remove('active');
      currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
      slideshowImages[currentImageIndex].classList.add('active');
    }
    
    setInterval(updateSlideshow, 5000);
  }

  
  // --- Xử lý Modal đăng bài mới ---
  const newPostModal = document.getElementById('new-post-modal');
  const postButton = document.getElementById('post-button');
  const closeNewPostModal = document.getElementById('close-new-post-modal');
  const newPostForm = document.getElementById('new-post-form');

  if (postButton && newPostModal) {
    postButton.addEventListener('click', () => {
      newPostModal.style.display = 'flex';
    });
  }

  if (closeNewPostModal && newPostModal) {
    closeNewPostModal.addEventListener('click', () => {
      newPostModal.style.display = 'none';
    });
  }

  if (newPostModal) {
    window.addEventListener('click', (e) => {
      if (e.target === newPostModal) {
        newPostModal.style.display = 'none';
      }
    });
  }

  if (newPostForm) {
    newPostForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(newPostForm);
      
      try {
        const response = await fetch(window.location.pathname, {
          method: 'POST',
          headers: {
            'X-CSRFToken': csrftoken,
          },
          body: formData,
        });
        
        if (response.ok) {
          newPostModal.style.display = 'none';
          newPostForm.reset();
          // Reload trang để hiển thị bài viết mới
          window.location.reload();
        } else {
          const errorData = await response.text();
          console.error('Lỗi khi đăng bài:', errorData);
          alert('投稿中にエラーが発生しました。');
        }

      } catch (error) {
        console.error('Lỗi mạng:', error);
        // Có thể vẫn thành công, reload để kiểm tra
        window.location.reload();
      }
    });
  }
  
  // --- Xử lý tìm kiếm trên trang Discussions ---
  const discussionsSearchInput = document.getElementById('discussions-search');
  const discussionsSearchButton = document.getElementById('discussions-search-button');

  // --- Xử lý tìm kiếm trên trang General ---
  const generalSearchInput = document.getElementById('general-search');
  const generalSearchButton = document.getElementById('general-search-button');

  // Hàm thực hiện tìm kiếm và chuyển hướng
  
  function performDiscussionSearch() {
    const keyword = discussionsSearchInput.value.trim();
    const params = new URLSearchParams(window.location.search);

    if (keyword) {
      params.set('q', keyword);
    } else {
      params.delete('q');
    }

    window.location.href = `/discussions/?${params.toString()}`;
  }

      

  // Hàm thực hiện tìm kiếm và chuyển hướng
  function performGeneralSearch() {
      const keyword = generalSearchInput.value.trim();
      if (keyword) {
          // Chuyển hướng đến URL với từ khóa tìm kiếm
          window.location.href = `/general/?q=${encodeURIComponent(keyword)}`;
      } else {
          // Nếu không có từ khóa, chuyển hướng về trang general
          window.location.href = `/general/`;
      }
  }

  // Gắn sự kiện click vào nút tìm kiếm
  if (discussionsSearchButton) {
      discussionsSearchButton.addEventListener('click', performDiscussionSearch);
  }

  // Gắn sự kiện click vào nút tìm kiếm trên trang General
  if (generalSearchButton) {
      generalSearchButton.addEventListener('click', performGeneralSearch);
  }

  // Gắn sự kiện nhấn phím Enter vào ô input
  if (discussionsSearchInput) {
      discussionsSearchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
              performDiscussionSearch();
          }
      });
  }

  // Gắn sự kiện nhấn phím Enter vào ô input trên trang General
  if (generalSearchInput) {
      generalSearchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
              performGeneralSearch();
          }
      });
  }
});