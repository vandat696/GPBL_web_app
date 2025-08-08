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
      title: "日本の労働ビザの申請手続きは複雑ですか？",
      body: "日本の労働ビザを申請するには、労働契約書、卒業証書、個人情報など、多くの書類が必要です。 このプロセスには数か月かかる場合がありますが、十分に準備すれば、すべてがスムーズに進みます。",
      tags: ["手続き", "仕事"],
      country: "Japan",
      image: "https://jfbfe.or.jp/column/wp-content/uploads/2025/07/A082_%E6%97%A5%E6%9C%AC-%E5%B0%B1%E5%8A%B4%E3%83%93%E3%82%B6-%E9%9B%A3%E3%81%97%E3%81%84.png",
    },
    {
      id: 2,
      title: "アメリカでアパートを見つけるには？",
      body: "アメリカで家を探すのは、Zillow、Apartments.com、Craigslistなどのウェブサイトを通じて非常に簡単です。 来る前に検索し、収入証明書などの必要な書類を準備する必要があります。",
      tags: ["手続き"],
      country: "America",
      image: "https://assets.st-note.com/production/uploads/images/144583974/rectangle_large_type_2_9ea5ec280fa5bd10941603a59bc4df5b.png?width=1200",
    },
    {
      id: 3,
      title: "ベトナムの食文化の特徴は何ですか？",
      body: "ベトナム料理は、その多様性と絶妙な味で有名です。 フォー、ブンチャー、バインミーはぜひお試しください。 各地域には独自の名物料理があります。",
      tags: ["食べ物"],
      country: "Vietnam",
      image: "https://blog.onecoinenglish.com/sys/wp-content/uploads/2025/04/3-1-1024x576.jpg",
    },
    {
      id: 4,
      title: "フランスの天気はどのように変化しますか？",
      body: "フランスは温暖な気候で、四季がはっきりしています。 夏は暑くて乾燥しており、冬は寒くて湿っています。 季節に合った服を用意する必要があります。",
      tags: ["気候"],
      country: "France",
      image: "https://www.arukikata.co.jp/wp-content/uploads/20230531150744e924a1f21920.jpg",
    },
    {
      id: 5,
      title: "日本語を学ぶのは難しいですか？",
      body: "日本語には、ひらがな、カタカナ、漢字の3つのアルファベットがあり、これは初心者にとって難しい場合があります。 ただし、日本語の文法は比較的簡単で、他の言語よりも学びやすいです。",
      tags: ["言語"],
      country: "Japan",
      image: "https://alote.inmybook.jp/wp-content/uploads/2022/03/study_nihongo.png",
    },
    {
      id: 6,
      title: "アメリカで面接に成功するためのヒント",
      body: "アメリカでの面接は、ソフトスキルと実際の職務経験を重視することがよくあります。 回答を注意深く準備し、自信を示す必要があります。",
      tags: ["仕事"],
      country: "America",
      image: "https://sekai-ju.com/wp-content/uploads/2018/03/%E3%82%A2%E3%83%A1%E3%83%AA%E3%82%AB%E3%81%AE%E9%9D%A2%E6%8E%A5%EF%BC%91%EF%BC%90%E3%81%AE%E3%82%B3%E3%83%84.jpg",
    },
  ];

  const issuesList = document.getElementById('issues-list');
  const issuesTagsContainer = document.getElementById('issue-tags');
  const issuesSearchInput = document.getElementById('issues-search');
  
  // Danh sách các tag có sẵn
  const availableTags = ["手続き", "仕事", "言語", "食べ物", "気候", "文化"];

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
              <span>国: ${postData.country}</span>
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
