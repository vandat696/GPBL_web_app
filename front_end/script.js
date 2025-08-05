document.addEventListener('DOMContentLoaded', () => {

    // --- Xử lý thanh điều hướng và chuyển trang ---
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
            
            // Dừng slideshow khi chuyển trang khác Trang chủ
            if (pageId !== 'home') {
                clearInterval(slideshowInterval);
            } else {
                startSlideshow();
            }
        });
    });

    // --- Chức năng Slideshow trang chủ ---
    const slideshowImages = [
        "https://placehold.co/1200x800/d1d1d1/212121?text=Vietnam",
        "https://placehold.co/1200x800/e0e0e0/333333?text=Japan",
        "https://placehold.co/1200x800/c0c0c0/111111?text=USA",
        "https://placehold.co/1200x800/b0b0b0/000000?text=France"
    ];
    let currentImageIndex = 0;
    const slideshowImageElement = document.querySelector('.slideshow-image');
    let slideshowInterval;

    function startSlideshow() {
        slideshowImageElement.src = slideshowImages[currentImageIndex];
        slideshowInterval = setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
            slideshowImageElement.src = slideshowImages[currentImageIndex];
        }, 5000); // Thay đổi hình ảnh sau mỗi 5 giây
    }
    
    startSlideshow();

    // --- Dữ liệu mô phỏng ---
    const allTags = ['Đồ ăn', 'Ngôn ngữ', 'Khí hậu', 'Thủ tục', 'Visa', 'Làm việc', 'Học tập', 'Văn hóa', 'Giao thông'];

    const issuesData = [
        { id: 'i1', title: 'Khó khăn khi xin Visa làm việc tại Nhật Bản', description: 'Visa làm việc tại Nhật Bản đòi hỏi nhiều thủ tục và giấy tờ phức tạp...', image: 'https://placehold.co/250x150', tags: ['Thủ tục', 'Visa', 'Làm việc'], country: 'japan', content: 'Nội dung chi tiết về việc xin visa làm việc tại Nhật Bản...' },
        { id: 'i2', title: 'Sự khác biệt văn hóa ẩm thực ở Hoa Kỳ', description: 'Đồ ăn nhanh phổ biến, khẩu vị khác biệt, và việc tìm kiếm đồ ăn truyền thống...', image: 'https://placehold.co/250x150', tags: ['Đồ ăn', 'Văn hóa'], country: 'usa', content: 'Nội dung chi tiết về văn hóa ẩm thực ở Hoa Kỳ...' },
        { id: 'i3', title: 'Thách thức khi học ngôn ngữ tiếng Pháp', description: 'Học tiếng Pháp không chỉ khó về ngữ pháp mà còn về cách phát âm...', image: 'https://placehold.co/250x150', tags: ['Ngôn ngữ', 'Học tập'], country: 'france', content: 'Nội dung chi tiết về việc học tiếng Pháp...' },
        { id: 'i4', title: 'Thích nghi với khí hậu nhiệt đới tại Việt Nam', description: 'Thời tiết nóng ẩm, mưa nhiều và thay đổi thất thường là thách thức lớn...', image: 'https://placehold.co/250x150', tags: ['Khí hậu'], country: 'vietnam', content: 'Nội dung chi tiết về việc thích nghi với khí hậu Việt Nam...' },
    ];
    
    let discussionsData = [
        { id: 'd1', title: 'Kinh nghiệm đi lại bằng tàu điện ngầm ở Tokyo', description: 'Hệ thống tàu điện ngầm ở Tokyo rất phức tạp, nhưng có một vài mẹo nhỏ có thể giúp bạn...', image: 'https://placehold.co/250x150', video: '', tags: ['Giao thông', 'Văn hóa'], country: 'japan', likes: 15, dislikes: 2, comments: [{ author: 'User1', text: 'Bài viết rất hữu ích!' }], content: 'Nội dung chi tiết của bài thảo luận về đi lại ở Tokyo...' },
        { id: 'd2', title: 'Tư vấn tìm việc làm thêm cho du học sinh ở Mỹ', description: 'Mình đang là du học sinh ở Mỹ và muốn tìm việc làm thêm, có ai có kinh nghiệm gì không?', image: 'https://placehold.co/250x150', video: '', tags: ['Làm việc', 'Học tập'], country: 'usa', likes: 25, dislikes: 1, comments: [{ author: 'User2', text: 'Bạn có thể thử tìm ở các khu vực gần trường.' }], content: 'Nội dung chi tiết của bài thảo luận về tìm việc ở Mỹ...' },
    ];

    // --- Render tags, issues và discussions ---
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
                        <span>Tags: ${item.tags.join(', ')}</span>
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

        // Sắp xếp bài thảo luận theo tương tác
        if (pageId === 'discussions-page') {
            filteredData.sort((a, b) => (b.likes + b.comments.length) - (a.likes + a.comments.length));
        }

        const containerId = pageId === 'issues-page' ? 'issues-list' : 'discussions-list';
        renderCards(containerId, filteredData);
    }
    
    // Thêm tags vào sidebar
    renderTags('issue-tags', allTags);
    renderTags('discussion-tags', allTags);
    
    // Lắng nghe sự kiện click vào tag
    document.querySelectorAll('.tag-list').forEach(tagList => {
        tagList.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag')) {
                e.target.classList.toggle('selected');
                filterAndRender();
            }
        });
    });

    // Lắng nghe sự kiện thay đổi quốc gia
    countrySelect.addEventListener('change', filterAndRender);

    // Render ban đầu
    filterAndRender();

    // --- Chức năng xem bài viết chi tiết (Modal) và vote Like/Dislike ---
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
                
                // Lấy trạng thái vote từ localStorage để hiển thị màu sắc trong modal
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
                                <span>Tags: ${data.tags.join(', ')}</span>
                            </div>
                            <div class="comments-section">
                                <h3>Bình luận</h3>
                                <div id="comments-list">
                                    ${data.comments.map(c => `<div class="comment"><strong>${c.author}:</strong> ${c.text}</div>`).join('')}
                                </div>
                                <form id="new-comment-form">
                                    <input type="text" placeholder="Viết bình luận của bạn..." required>
                                    <button type="submit">Gửi</button>
                                </form>
                            </div>
                        ` : ''}
                    </div>
                `;
                postModal.style.display = 'block';
                
                // Thêm sự kiện gửi bình luận
                if (type === 'discussion') {
                    document.getElementById('new-comment-form').addEventListener('submit', (e) => {
                        e.preventDefault();
                        const commentText = e.target.querySelector('input').value;
                        const newComment = { author: 'Người dùng ẩn danh', text: commentText };
                        data.comments.push(newComment);
                        
                        // Cập nhật lại giao diện bình luận
                        const commentsList = document.getElementById('comments-list');
                        const newCommentDiv = document.createElement('div');
                        newCommentDiv.className = 'comment';
                        newCommentDiv.innerHTML = `<strong>${newComment.author}:</strong> ${newComment.text}`;
                        commentsList.appendChild(newCommentDiv);
                        
                        e.target.reset();
                        filterAndRender(); // Cập nhật lại danh sách thảo luận
                    });
                }
            }
        });
    });

    // Thêm sự kiện lắng nghe click vào các nút like/dislike bên trong modal
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
                // Nếu đã vote cùng một hành động, không làm gì cả
                return;
            } else if (currentUserVote) {
                // Nếu đã vote nhưng bấm nút khác, cần gỡ vote cũ
                if (currentUserVote === 'like') {
                    post.likes--;
                } else {
                    post.dislikes--;
                }
            }
            
            // Thêm vote mới
            if (action === 'like') {
                post.likes++;
            } else {
                post.dislikes++;
            }

            // Cập nhật localStorage
            localStorage.setItem(userVoteKey, action);

            // Cập nhật giao diện modal
            const likeCountElement = modalBody.querySelector('.like-count');
            const dislikeCountElement = modalBody.querySelector('.dislike-count');
            likeCountElement.textContent = post.likes;
            dislikeCountElement.textContent = post.dislikes;
            
            // Cập nhật class để đổi màu nút
            modalBody.querySelectorAll('.vote-button').forEach(btn => {
                btn.classList.remove('liked', 'disliked');
            });
            voteButton.classList.add(action === 'like' ? 'liked' : 'disliked');
            
            // Cập nhật UI trên danh sách chính
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

    // --- Chức năng đăng bài thảo luận mới ---
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
        const country = countrySelect.value; // Gán quốc gia đang chọn

        const newPost = {
            id: `d${discussionsData.length + 1}`,
            title,
            description: content.substring(0, 100) + '...', // Lấy một phần nội dung làm mô tả
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
        
        // Cập nhật lại danh sách thảo luận
        filterAndRender();
        document.querySelector('[data-page="discussions"]').click();
    });

});
