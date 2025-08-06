document.addEventListener('DOMContentLoaded', () => {

  // --- ナビゲーションバーとページ切り替えの処理 ---
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

  // --- ホームページのスライドショー機能 ---
  const slideshowImages = [
    "https://placehold.co/1200x800/d1d1d1/212121?text=ベトナム",
    "https://placehold.co/1200x800/e0e0e0/333333?text=日本",
    "https://placehold.co/1200x800/c0c0c0/111111?text=アメリカ",
    "https://placehold.co/1200x800/b0b0b0/000000?text=フランス"
  ];
  let currentImageIndex = 0;
  const slideshowImageElement = document.querySelector('.slideshow-image');

  function startSlideshow() {
    slideshowImageElement.src = slideshowImages[currentImageIndex];
  }
  
  startSlideshow();

  // --- タグ、記事、ディスカッションのレンダリング ---
  const allTags = ['食べ物', '言語', '気候', '手続き', 'ビザ', '仕事', '学習', '文化', '交通'];

  const issuesData = [
    { id: 'i1', title: '日本での就労ビザ申請の課題', description: '日本の就労ビザは多くの複雑な書類と手続きが必要です...', image: 'https://placehold.co/250x150', tags: ['手続き', 'ビザ', '仕事'], country: 'japan', content: '日本の就労ビザ申請に関する詳細内容...' },
    { id: 'i2', title: 'アメリカでの食文化の違い', description: 'ファーストフードが一般的で、好みの違いや伝統的な食べ物を見つけるのが難しい...', image: 'https://placehold.co/250x150', tags: ['食べ物', '文化'], country: 'usa', content: 'アメリカの食文化に関する詳細内容...' },
    { id: 'i3', title: 'フランス語学習の挑戦', description: 'フランス語は文法だけでなく、発音も難しい...', image: 'https://placehold.co/250x150', tags: ['言語', '学習'], country: 'france', content: 'フランス語学習に関する詳細内容...' },
    { id: 'i4', title: 'ベトナムの熱帯気候への適応', description: '暑く湿度が高い天気と不規則な天候の変化は大きな課題です...', image: 'https://placehold.co/250x150', tags: ['気候'], country: 'vietnam', content: 'ベトナムの気候への適応に関する詳細内容...' },
  ];
  
  let discussionsData = [
    { id: 'd1', title: '東京の地下鉄での移動経験', description: '東京の地下鉄システムは非常に複雑ですが、いくつかの小さなコツで便利になります...', image: 'https://placehold.co/250x150', video: '', tags: ['交通', '文化'], country: 'japan', likes: 15, dislikes: 2, comments: [{ author: 'User1', text: 'とても役立つ投稿です！' }], content: '東京での交通に関するディスカッションの詳細内容...' },
    { id: 'd2', title: 'アメリカの留学生向けアルバイト探しのアドバイス', description: 'アメリカの留学生でアルバイトを探しています。何か経験のある方はいませんか？', image: 'https://placehold.co/250x150', video: '', tags: ['仕事', '学習'], country: 'usa', likes: 25, dislikes: 1, comments: [{ author: 'User2', text: '学校近くのエリアで探してみるといいかもしれません。' }], content: 'アメリカでの仕事探しに関するディスカッションの詳細内容...' },
  ];

  function renderTags(containerId, tags) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    tags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'tag';
      tagSpan.textContent = tag;
      tagSpan.dataset.tag = tag;
      container.appendChild(tagSpan);
    });
  }

  function renderCards(containerId, data) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.id = item.id;
      card.dataset.type = containerId === 'issues-list' ? 'issue' : 'discussion';

      const cardHtml = `
        <img src="${item.image}" alt="${item.title}" class="card-image">
        <div class="card-body">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          ${containerId === 'discussions-list' ? `<div class="card-meta">
            <div class="post-actions">
              <span><i class="fa-solid fa-thumbs-up"></i> <span class="like-count">${item.likes}</span></span>
              <span><i class="fa-solid fa-thumbs-down"></i> <span class="dislike-count">${item.dislikes}</span></span>
              <span><i class="fa-solid fa-comment"></i> ${item.comments.length}</span>
            </div>
            <span>タグ: ${item.tags.join(', ')}</span>
          </div>` : ''}
        </div>
      `;
      card.innerHTML = cardHtml;
      container.appendChild(card);
    });
  }

  function filterAndRender() {
    const activePage = document.querySelector('.page.active');
    const pageId = activePage.id;
    
    const dataToRender = pageId === 'issues-page' ? issuesData : discussionsData;
    const containerId = pageId === 'issues-page' ? 'issues-list' : 'discussions-list';
    renderCards(containerId, dataToRender);
  }
  
  renderTags('issue-tags', allTags);
  renderTags('discussion-tags', allTags);

  filterAndRender();

  // --- 記事詳細（モーダル）表示と「いいね/悪いね」機能 ---
  const postModal = document.getElementById('post-modal');
  const modalBody = document.getElementById('modal-body');
  const closeButton = postModal.querySelector('.close-button');

  document.querySelectorAll('.card-list').forEach(list => {
    list.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (card) {
        const id = card.dataset.id;
        const type = card.dataset.type;
        const data = type === 'issue' ? issuesData.find(d => d.id === id) : discussionsData.find(d => d.id === id);
        
        modalBody.innerHTML = `
          <div class="full-post">
            <h2>${data.title}</h2>
            ${data.image ? `<img src="${data.image}" alt="${data.title}">` : ''}
            ${data.video ? `<video controls><source src="${data.video}"></video>` : ''}
            <p>${data.content}</p>
            ${type === 'discussion' ? `
              <div class="card-meta">
                <div class="post-actions">
                  <span class="vote-button like-button" data-id="${data.id}" data-action="like"><i class="fa-solid fa-thumbs-up"></i> <span class="like-count">${data.likes}</span></span>
                  <span class="vote-button dislike-button" data-id="${data.id}" data-action="dislike"><i class="fa-solid fa-thumbs-down"></i> <span class="dislike-count">${data.dislikes}</span></span>
                  <span><i class="fa-solid fa-comment"></i> ${data.comments.length}</span>
                </div>
                <span>タグ: ${data.tags.join(', ')}</span>
              </div>
              <div class="comments-section">
                <h3>コメント</h3>
                <div id="comments-list">
                  ${data.comments.map(c => `<div class="comment"><strong>${c.author}:</strong> ${c.text}</div>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
        postModal.style.display = 'block';
      }
    });
  });
  
  closeButton.addEventListener('click', () => {
    postModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === postModal) {
      postModal.style.display = 'none';
    }
  });

  // --- 新規ディスカッション投稿機能 ---
  const newPostModal = document.getElementById('new-post-modal');
  const postButton = document.getElementById('post-button');
  const closeNewPostModal = document.getElementById('close-new-post-modal');

  postButton.addEventListener('click', () => {
    newPostModal.style.display = 'block';
  });

  closeNewPostModal.addEventListener('click', () => {
    newPostModal.style.display = 'none';
  });
});