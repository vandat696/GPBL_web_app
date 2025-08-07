document.addEventListener('DOMContentLoaded', () => {

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

  // --- Xử lý chuyển trang và thanh điều hướng ---
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  const homePage = document.getElementById('home-page');
  const issuesPage = document.getElementById('issues-page');
  const discussionsPage = document.getElementById('discussions-page');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      const pageId = item.dataset.page;
      pages.forEach(page => page.style.display = 'none');
      document.getElementById(`${pageId}-page`).style.display = 'block';
      
      // Nếu là trang issues, render danh sách bài viết
      if (pageId === 'issues') {
        renderIssues(issuesData);
      }
    });
  });
  
  // Hiển thị trang chủ mặc định và các bài viết issues nếu có
  homePage.style.display = 'block';

  // --- Slideshow trên trang chủ (có hiệu ứng fade) ---
  const slideshowImages = document.querySelectorAll('#home-page .slideshow-image');
  let currentImageIndex = 0;

  if (slideshowImages.length > 0) {
    slideshowImages[currentImageIndex].classList.add('active');
  }
  
  function updateSlideshow() {
    slideshowImages[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
    slideshowImages[currentImageIndex].classList.add('active');
  }
  
  setInterval(updateSlideshow, 5000);


  // --- Dữ liệu giả lập cho trang FAQ ---
  const issuesData = [
    {
      id: 1,
      title: "Thủ tục xin visa lao động ở Nhật Bản có phức tạp không?",
      body: "Thủ tục xin visa lao động tại Nhật Bản yêu cầu nhiều giấy tờ như hợp đồng lao động, bằng cấp và hồ sơ cá nhân. Quá trình này có thể mất vài tháng, nhưng nếu bạn chuẩn bị đầy đủ, mọi việc sẽ diễn ra suôn sẻ.",
      tags: ["thủ tục", "công việc"],
      country: "Japan",
      image: "https://placehold.co/600x400/94A3B8/ffffff?text=Thủ+tục+visa",
    },
    {
      id: 2,
      title: "Làm thế nào để tìm được nhà trọ ở Mỹ?",
      body: "Việc tìm nhà ở Mỹ khá dễ dàng thông qua các trang web như Zillow, Apartments.com hoặc Craigslist. Bạn nên tìm kiếm trước khi đến và chuẩn bị các giấy tờ cần thiết như chứng minh thu nhập.",
      tags: ["thủ tục"],
      country: "America",
      image: "https://placehold.co/600x400/FDBA74/ffffff?text=Nhà+trọ+ở+Mỹ",
    },
    {
      id: 3,
      title: "Văn hóa ẩm thực Việt Nam có gì đặc biệt?",
      body: "Ẩm thực Việt Nam nổi tiếng với sự đa dạng và hương vị tinh tế. Phở, bún chả và bánh mì là những món ăn mà bạn nhất định phải thử. Mỗi vùng miền lại có những đặc sản riêng biệt.",
      tags: ["đồ ăn"],
      country: "Vietnam",
      image: "https://placehold.co/600x400/BEF264/ffffff?text=Ẩm+thực+Việt",
    },
    {
      id: 4,
      title: "Thời tiết ở Pháp thay đổi như thế nào?",
      body: "Pháp có khí hậu ôn đới, với 4 mùa rõ rệt. Mùa hè nóng và khô, trong khi mùa đông lạnh và ẩm ướt. Bạn nên chuẩn bị quần áo phù hợp cho từng mùa.",
      tags: ["khí hậu"],
      country: "France",
      image: "https://placehold.co/600x400/FCA5A5/ffffff?text=Thời+tiết+Pháp",
    },
    {
      id: 5,
      title: "Học tiếng Nhật có khó không?",
      body: "Tiếng Nhật có 3 bảng chữ cái là Hiragana, Katakana và Kanji, điều này có thể gây khó khăn cho người mới bắt đầu. Tuy nhiên, ngữ pháp của tiếng Nhật lại khá đơn giản và dễ học hơn so với một số ngôn ngữ khác.",
      tags: ["ngôn ngữ"],
      country: "Japan",
      image: "https://placehold.co/600x400/A5B4FC/ffffff?text=Học+tiếng+Nhật",
    },
    {
      id: 6,
      title: "Bí quyết phỏng vấn thành công ở Mỹ",
      body: "Phỏng vấn ở Mỹ thường chú trọng vào kỹ năng mềm và kinh nghiệm làm việc thực tế. Bạn nên chuẩn bị kỹ lưỡng các câu trả lời và thể hiện sự tự tin.",
      tags: ["công việc"],
      country: "America",
      image: "https://placehold.co/600x400/E9D5FF/ffffff?text=Phỏng+vấn+Mỹ",
    },
  ];

  const issuesList = document.getElementById('issues-list');
  const issuesTagsContainer = document.getElementById('issue-tags');
  const issuesSearchInput = document.getElementById('issues-search');
  
  // Danh sách các tag có sẵn
  const availableTags = ["thủ tục", "công việc", "ngôn ngữ", "đồ ăn", "khí hậu"];

  // Tạo và hiển thị các tag
  function renderTags() {
    issuesTagsContainer.innerHTML = '';
    availableTags.forEach(tagText => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag';
      tagElement.dataset.tag = tagText;
      tagElement.textContent = tagText.charAt(0).toUpperCase() + tagText.slice(1);
      issuesTagsContainer.appendChild(tagElement);
    });
  }

  // Hàm để render danh sách bài viết
  function renderIssues(posts) {
    issuesList.innerHTML = '';
    if (posts.length === 0) {
      issuesList.innerHTML = '<p style="text-align:center; color:#666;">Không tìm thấy bài viết nào.</p>';
      return;
    }
    posts.forEach(post => {
      const postCard = document.createElement('div');
      postCard.className = 'card';
      postCard.dataset.id = post.id;
      postCard.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <div class="card-content">
          <h4 class="card-title">${post.title}</h4>
          <p class="card-description">${post.body.substring(0, 100)}...</p>
          <div class="card-tags">
            ${post.tags.map(tag => `<span class="tag-in-card">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`).join('')}
          </div>
        </div>
      `;
      issuesList.appendChild(postCard);
    });
  }

  // Hàm lọc bài viết
  function filterIssues() {
    const activeTags = Array.from(issuesTagsContainer.querySelectorAll('.tag.active')).map(tag => tag.dataset.tag);
    const searchTerm = issuesSearchInput.value.toLowerCase().trim();

    let filteredIssues = issuesData;

    // Lọc theo tag
    if (activeTags.length > 0) {
      filteredIssues = filteredIssues.filter(issue => 
        activeTags.every(tag => issue.tags.includes(tag))
      );
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filteredIssues = filteredIssues.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm) || 
        issue.body.toLowerCase().includes(searchTerm)
      );
    }
    
    renderIssues(filteredIssues);
  }

  // Khởi tạo hiển thị tag và bài viết khi vào trang issues
  renderTags();
  renderIssues(issuesData);

  // Xử lý sự kiện click trên tag
  issuesTagsContainer.addEventListener('click', (e) => {
    const tagElement = e.target.closest('.tag');
    if (!tagElement) return;
    
    // Toggle class 'active' cho tag được click
    tagElement.classList.toggle('active');
    
    // Thực hiện lọc lại bài viết
    filterIssues();
  });

  // Xử lý sự kiện tìm kiếm
  issuesSearchInput.addEventListener('input', filterIssues);

  // --- Xử lý Modal chi tiết bài viết ---
  const postModal = document.getElementById('post-modal');
  const closePostModal = document.getElementById('close-post-modal');

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) {
      const postId = parseInt(card.dataset.id);
      const postData = issuesData.find(post => post.id === postId);

      if (postData) {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
          <div class="full-post">
            <h2 class="text-2xl font-bold mb-2">${postData.title}</h2>
            <div class="post-meta">
              <span>Quốc gia: ${postData.country}</span>
            </div>
            <img src="${postData.image}" alt="${postData.title}">
            <div class="prose max-w-none">
              <p>${postData.body}</p>
            </div>
            <div class="card-tags mt-4">
              ${postData.tags.map(tag => `<span class="tag-in-card">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`).join('')}
            </div>
          </div>
        `;
        postModal.style.display = 'flex';
      }
    }
  });

  closePostModal.addEventListener('click', () => {
    postModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === postModal) {
      postModal.style.display = 'none';
    }
  });

  // --- Xử lý Modal đăng bài mới (Không thay đổi) ---
  const newPostModal = document.getElementById('new-post-modal');
  const postButton = document.getElementById('post-button');
  const closeNewPostModal = document.getElementById('close-new-post-modal');
  const newPostForm = document.getElementById('new-post-form');

  postButton.addEventListener('click', () => {
    newPostModal.style.display = 'flex';
  });

  closeNewPostModal.addEventListener('click', () => {
    newPostModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === newPostModal) {
      newPostModal.style.display = 'none';
    }
  });

  newPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(newPostForm);
    
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrftoken,
        },
        body: formData,
      });
      
      if (response.ok) {
        newPostModal.style.display = 'none';
        newPostForm.reset();
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
