document.addEventListener('DOMContentLoaded', () => {

    // --- ナビゲーションバーとページ切り替えの処理 ---
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const countrySelect = document.getElementById('country-select');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const pageId = item.dataset.page;
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(`${pageId}-page`).classList.add('active');
            
            // ホームページ以外のページに切り替えるときはスライドショーを停止
            if (pageId !== 'home') {
                clearInterval(slideshowInterval);
            } else {
                startSlideshow();
            }
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
    let slideshowInterval;

    function startSlideshow() {
        slideshowImageElement.src = slideshowImages[currentImageIndex];
        slideshowInterval = setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
            slideshowImageElement.src = slideshowImages[currentImageIndex];
        }, 5000); // 5秒ごとに画像を切り替える
    }
    
    startSlideshow();

    // --- モックデータ ---
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

    // --- タグ、記事、ディスカッションのレンダリング ---
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
        const selectedCountry = countrySelect.value;
        const activePage = document.querySelector('.page.active');
        const pageId = activePage.id;

        const activeTagsContainer = pageId === 'issues-page' ? document.getElementById('issue-tags') : document.getElementById('discussion-tags');
        const selectedTags = Array.from(activeTagsContainer.querySelectorAll('.tag.selected')).map(tag => tag.dataset.tag);
        
        const dataToRender = pageId === 'issues-page' ? issuesData : discussionsData;
        
        const filteredData = dataToRender.filter(item => {
            const matchesCountry = selectedCountry === 'all' || item.country === selectedCountry;
            const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => item.tags.includes(tag));
            return matchesCountry && matchesTags;
        });

        // インタラクションに基づいてディスカッション投稿をソート
        if (pageId === 'discussions-page') {
            filteredData.sort((a, b) => (b.likes + b.comments.length) - (a.likes + a.comments.length));
        }

        const containerId = pageId === 'issues-page' ? 'issues-list' : 'discussions-list';
        renderCards(containerId, filteredData);
    }
    
    // サイドバーにタグを追加
    renderTags('issue-tags', allTags);
    renderTags('discussion-tags', allTags);
    
    // タグクリックイベントをリッスン
    document.querySelectorAll('.tag-list').forEach(tagList => {
        tagList.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag')) {
                e.target.classList.toggle('selected');
                filterAndRender();
            }
        });
    });

    // 国の選択変更イベントをリッスン
    countrySelect.addEventListener('change', filterAndRender);

    // 初回レンダリング
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
                
                // localStorageから投票状態を取得してモーダルの色を決定
                const userVote = localStorage.getItem(`post-vote-${data.id}`);
                const likeClass = userVote === 'like' ? 'liked' : '';
                const dislikeClass = userVote === 'dislike' ? 'disliked' : '';

                modalBody.innerHTML = `
                    <div class="full-post">
                        <h2>${data.title}</h2>
                        ${data.image ? `<img src="${data.image}" alt="${data.title}">` : ''}
                        ${data.video ? `<video controls><source src="${data.video}"></video>` : ''}
                        <p>${data.content}</p>
                        ${type === 'discussion' ? `
                            <div class="card-meta">
                                <div class="post-actions">
                                    <span class="vote-button like-button ${likeClass}" data-id="${data.id}" data-action="like"><i class="fa-solid fa-thumbs-up"></i> <span class="like-count">${data.likes}</span></span>
                                    <span class="vote-button dislike-button ${dislikeClass}" data-id="${data.id}" data-action="dislike"><i class="fa-solid fa-thumbs-down"></i> <span class="dislike-count">${data.dislikes}</span></span>
                                    <span><i class="fa-solid fa-comment"></i> ${data.comments.length}</span>
                                </div>
                                <span>タグ: ${data.tags.join(', ')}</span>
                            </div>
                            <div class="comments-section">
                                <h3>コメント</h3>
                                <div id="comments-list">
                                    ${data.comments.map(c => `<div class="comment"><strong>${c.author}:</strong> ${c.text}</div>`).join('')}
                                </div>
                                <form id="new-comment-form">
                                    <input type="text" placeholder="コメントを書き込む..." required>
                                    <button type="submit">送信</button>
                                </form>
                            </div>
                        ` : ''}
                    </div>
                `;
                postModal.style.display = 'block';
                
                // コメント送信イベントを追加
                if (type === 'discussion') {
                    document.getElementById('new-comment-form').addEventListener('submit', (e) => {
                        e.preventDefault();
                        const commentText = e.target.querySelector('input').value;
                        const newComment = { author: '匿名ユーザー', text: commentText };
                        data.comments.push(newComment);
                        
                        // コメント表示を更新
                        const commentsList = document.getElementById('comments-list');
                        const newCommentDiv = document.createElement('div');
                        newCommentDiv.className = 'comment';
                        newCommentDiv.innerHTML = `<strong>${newComment.author}:</strong> ${newComment.text}`;
                        commentsList.appendChild(newCommentDiv);
                        
                        e.target.reset();
                        filterAndRender(); // ディスカッションリストを更新
                    });
                }
            }
        });
    });

    // モーダル内の「いいね/悪いね」ボタンのクリックイベントを追加
    modalBody.addEventListener('click', (e) => {
        const voteButton = e.target.closest('.vote-button');
        if (voteButton) {
            e.preventDefault();
            const postId = voteButton.dataset.id;
            const action = voteButton.dataset.action;
            const post = discussionsData.find(p => p.id === postId);
            if (!post) return;

            const userVoteKey = `post-vote-${postId}`;
            const currentUserVote = localStorage.getItem(userVoteKey);

            if (currentUserVote === action) {
                // 同じアクションに投票済みの場合、何もしない
                return;
            } else if (currentUserVote) {
                // 別の投票済みアクションの場合、古い投票を削除
                if (currentUserVote === 'like') {
                    post.likes--;
                } else {
                    post.dislikes--;
                }
            }
            
            // 新しい投票を追加
            if (action === 'like') {
                post.likes++;
            } else {
                post.dislikes++;
            }

            // localStorageを更新
            localStorage.setItem(userVoteKey, action);

            // モーダルのUIを更新
            const likeCountElement = modalBody.querySelector('.like-count');
            const dislikeCountElement = modalBody.querySelector('.dislike-count');
            likeCountElement.textContent = post.likes;
            dislikeCountElement.textContent = post.dislikes;
            
            // ボタンの色を変更するためのクラスを更新
            modalBody.querySelectorAll('.vote-button').forEach(btn => {
                btn.classList.remove('liked', 'disliked');
            });
            voteButton.classList.add(action === 'like' ? 'liked' : 'disliked');
            
            // メインリストのUIを更新
            filterAndRender();
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

    // --- 新規ディスカッション投稿機能 ---
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

    newPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim());
        const image = document.getElementById('post-image').value || 'https://placehold.co/250x150';
        const video = document.getElementById('post-video').value;
        const country = countrySelect.value; // 選択中の国を割り当て

        const newPost = {
            id: `d${discussionsData.length + 1}`,
            title,
            description: content.substring(0, 100) + '...', // 内容の一部を説明として取得
            image,
            video,
            tags,
            country,
            likes: 0,
            dislikes: 0,
            comments: [],
            content
        };
        discussionsData.push(newPost);
        newPostForm.reset();
        newPostModal.style.display = 'none';
        
        // ディスカッションリストを更新
        filterAndRender();
        document.querySelector('[data-page="discussions"]').click();
    });

    

});
