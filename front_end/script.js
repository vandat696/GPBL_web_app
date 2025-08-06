document.addEventListener('DOMContentLoaded', () => {

    // --- Cấu hình API Endpoint ---
    // Thay đổi URL này để khớp với địa chỉ backend Django của bạn
    const API_BASE_URL = 'http://127.0.0.1:8000/api/'; 

    // --- Hàm lấy CSRF Token từ cookie ---
    // Django yêu cầu CSRF token cho các yêu cầu POST, PUT, DELETE để bảo mật
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Kiểm tra xem chuỗi cookie có bắt đầu bằng tên chúng ta muốn không?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    // --- Khai báo các phần tử DOM và biến dữ liệu ---
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const countrySelect = document.getElementById('country-select');
    const issuesSearchInput = document.getElementById('issues-search');
    const discussionsSearchInput = document.getElementById('discussions-search');

    let issuesData = []; // Dữ liệu Issues sẽ được tải từ API
    let discussionsData = []; // Dữ liệu Discussions sẽ được tải từ API
    let allTags = []; // Danh sách Tags sẽ được tải từ API
    let allCountries = []; // Danh sách Countries sẽ được tải từ API

    // --- Chức năng Slideshow trang chủ ---
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
        }, 5000); // Thay đổi hình ảnh sau mỗi 5 giây
    }
    
    // --- Hàm tải dữ liệu từ API ---
    async function fetchData() {
        try {
            // Tải Tags
            const tagsResponse = await fetch(`${API_BASE_URL}tags/`);
            allTags = await tagsResponse.json();
            renderTags('issue-tags', allTags.map(tag => tag.name));
            renderTags('discussion-tags', allTags.map(tag => tag.name));

            // Tải Countries
            const countriesResponse = await fetch(`${API_BASE_URL}countries/`);
            allCountries = await countriesResponse.json();
            // Cập nhật select quốc gia
            countrySelect.innerHTML = '<option value="all">国を選択</option>';
            allCountries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name; // Giả định backend trả về tên quốc gia
                option.textContent = country.name;
                countrySelect.appendChild(option);
            });

            // Tải Issues và Discussions ban đầu
            await fetchIssues();
            await fetchDiscussions();
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu ban đầu từ API:', error);
        }
    }

    // Hàm tải danh sách Issues từ API với các bộ lọc
    async function fetchIssues() {
        const selectedCountry = countrySelect.value === 'all' ? '' : countrySelect.value;
        // Lấy các tag đã chọn từ DOM
        const selectedTags = Array.from(document.getElementById('issue-tags').querySelectorAll('.tag.selected')).map(tag => tag.dataset.tag).join(',');
        const searchTerm = issuesSearchInput.value;

        // Xây dựng query parameters
        let queryParams = new URLSearchParams();
        if (selectedCountry) queryParams.append('country', selectedCountry);
        if (selectedTags) queryParams.append('tags', selectedTags);
        if (searchTerm) queryParams.append('search', searchTerm);

        try {
            const response = await fetch(`${API_BASE_URL}issues/?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch issues');
            issuesData = await response.json(); // Cập nhật dữ liệu Issues
            renderCards('issues-list', issuesData); // Render lại danh sách
        } catch (error) {
            console.error('Lỗi khi tải Issues:', error);
        }
    }

    // Hàm tải danh sách Discussions từ API với các bộ lọc
    async function fetchDiscussions() {
        const selectedCountry = countrySelect.value === 'all' ? '' : countrySelect.value;
        // Lấy các tag đã chọn từ DOM
        const selectedTags = Array.from(document.getElementById('discussion-tags').querySelectorAll('.tag.selected')).map(tag => tag.dataset.tag).join(',');
        const searchTerm = discussionsSearchInput.value;

        // Xây dựng query parameters
        let queryParams = new URLSearchParams();
        if (selectedCountry) queryParams.append('country', selectedCountry);
        if (selectedTags) queryParams.append('tags', selectedTags);
        if (searchTerm) queryParams.append('search', searchTerm);

        try {
            const response = await fetch(`${API_BASE_URL}discussions/?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch discussions');
            discussionsData = await response.json(); // Cập nhật dữ liệu Discussions
            renderCards('discussions-list', discussionsData); // Render lại danh sách
        } catch (error) {
            console.error('Lỗi khi tải Discussions:', error);
        }
    }

    // --- Xử lý thanh điều hướng và chuyển trang ---
    navItems.forEach(item => {
        item.addEventListener('click', async (e) => {
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

            // Đặt lại thanh tìm kiếm và các tag đã chọn, sau đó tải lại dữ liệu cho trang mới
            if (issuesSearchInput) issuesSearchInput.value = '';
            if (discussionsSearchInput) discussionsSearchInput.value = '';
            document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('selected'));
            
            if (pageId === 'issues') {
                await fetchIssues();
            } else if (pageId === 'discussions') {
                await fetchDiscussions();
            }
        });
    });

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

            // Sử dụng image_url và video_url từ backend
            const cardHtml = `
                <img src="${item.image_url}" alt="${item.title}" class="card-image">
                <div class="card-body">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    ${containerId === 'discussions-list' ? `<div class="card-meta">
                        <div class="post-actions">
                            <span><i class="fa-solid fa-thumbs-up"></i> <span class="like-count">${item.likes}</span></span>
                            <span><i class="fa-solid fa-thumbs-down"></i> <span class="dislike-count">${item.dislikes}</span></span>
                            <span><i class="fa-solid fa-comment"></i> ${item.comments ? item.comments.length : 0}</span>
                        </div>
                        <span>タグ: ${item.tags ? item.tags.join(', ') : ''}</span>
                    </div>` : ''}
                </div>
            `;
            card.innerHTML = cardHtml;
            container.appendChild(card);
        });
    }

    // Hàm lọc và render lại dữ liệu (chỉ gọi các hàm fetch tương ứng)
    async function filterAndRender() {
        const activePage = document.querySelector('.page.active');
        const pageId = activePage.id;

        if (pageId === 'issues-page') {
            await fetchIssues();
        } else if (pageId === 'discussions-page') {
            await fetchDiscussions();
        }
    }
    
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
    // Lắng nghe sự kiện nhập liệu vào thanh tìm kiếm
    if (issuesSearchInput) issuesSearchInput.addEventListener('input', filterAndRender);
    if (discussionsSearchInput) discussionsSearchInput.addEventListener('input', filterAndRender);

    // Tải dữ liệu ban đầu khi DOM đã sẵn sàng
    fetchData();
    startSlideshow(); // Bắt đầu slideshow khi trang tải

    // --- Chức năng xem bài viết chi tiết (Modal) và vote Like/Dislike ---
    const postModal = document.getElementById('post-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = postModal.querySelector('.close-button');

    document.querySelectorAll('.card-list').forEach(list => {
        list.addEventListener('click', async (e) => {
            const card = e.target.closest('.card');
            if (card) {
                const id = card.dataset.id;
                const type = card.dataset.type;
                let data;

                try {
                    // Tải chi tiết bài viết từ API
                    if (type === 'issue') {
                        const response = await fetch(`${API_BASE_URL}issues/${id}/`);
                        if (!response.ok) throw new Error('Failed to fetch issue detail');
                        data = await response.json();
                    } else { // type === 'discussion'
                        const response = await fetch(`${API_BASE_URL}discussions/${id}/`);
                        if (!response.ok) throw new Error('Failed to fetch discussion detail');
                        data = await response.json();
                    }
                } catch (error) {
                    console.error('Lỗi khi tải chi tiết bài viết:', error);
                    alert("Đã xảy ra lỗi khi tải chi tiết bài viết. Vui lòng thử lại.");
                    return;
                }
                
                // Lấy trạng thái vote từ localStorage để hiển thị màu sắc trong modal
                // Lưu ý: Trong môi trường thực tế, trạng thái vote nên được quản lý bởi backend dựa trên người dùng đăng nhập.
                const userVote = localStorage.getItem(`post-vote-${data.id}`);
                const likeClass = userVote === 'like' ? 'liked' : '';
                const dislikeClass = userVote === 'dislike' ? 'disliked' : '';

                modalBody.innerHTML = `
                    <div class="full-post">
                        <h2>${data.title}</h2>
                        ${data.image_url ? `<img src="${data.image_url}" alt="${data.title}">` : ''}
                        ${data.video_url ? `<video controls><source src="${data.video_url}"></video>` : ''}
                        <p>${data.content}</p>
                        ${type === 'discussion' ? `
                            <div class="card-meta">
                                <div class="post-actions">
                                    <span class="vote-button like-button ${likeClass}" data-id="${data.id}" data-action="like"><i class="fa-solid fa-thumbs-up"></i> <span class="like-count">${data.likes}</span></span>
                                    <span class="vote-button dislike-button ${dislikeClass}" data-id="${data.id}" data-action="dislike"><i class="fa-solid fa-thumbs-down"></i> <span class="dislike-count">${data.dislikes}</span></span>
                                    <span><i class="fa-solid fa-comment"></i> ${data.comments ? data.comments.length : 0}</span>
                                </div>
                                <span>タグ: ${data.tags ? data.tags.join(', ') : ''}</span>
                            </div>
                            <div class="comments-section">
                                <h3>コメント</h3>
                                <div id="comments-list">
                                    ${data.comments ? data.comments.map(c => `<div class="comment"><strong>${c.author}:</strong> ${c.content}</div>`).join('') : ''}
                                </div>
                                <form id="new-comment-form" data-post-id="${data.id}">
                                    <input type="text" placeholder="コメントを書き込む..." required>
                                    <button type="submit">送信</button>
                                </form>
                            </div>
                        ` : ''}
                    </div>
                `;
                postModal.style.display = 'block';
                
                // Thêm sự kiện gửi bình luận
                if (type === 'discussion') {
                    document.getElementById('new-comment-form').addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const postId = e.target.dataset.postId;
                        const commentText = e.target.querySelector('input').value;
                        
                        try {
                            const response = await fetch(`${API_BASE_URL}discussions/${postId}/comments/`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRFToken': csrftoken // Gửi CSRF token
                                },
                                body: JSON.stringify({ content: commentText })
                            });

                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(`Failed to post comment: ${JSON.stringify(errorData)}`);
                            }
                            const newComment = await response.json(); // Lấy comment mới từ API

                            // Cập nhật lại giao diện bình luận
                            const commentsList = document.getElementById('comments-list');
                            const newCommentDiv = document.createElement('div');
                            newCommentDiv.className = 'comment';
                            newCommentDiv.innerHTML = `<strong>${newComment.author}:</strong> ${newComment.content}`;
                            commentsList.appendChild(newCommentDiv);
                            
                            e.target.reset();
                            // Không cần fetchDiscussions() ở đây vì chỉ cập nhật modal,
                            // nhưng cần cập nhật lại số lượng comment trên card chính
                            // Có thể gọi lại fetchDiscussions() hoặc cập nhật thủ công nếu cần
                            await fetchDiscussions(); 
                        } catch (error) {
                            console.error('Lỗi khi đăng bình luận:', error);
                            alert("Đã xảy ra lỗi khi đăng bình luận. Vui lòng thử lại.");
                        }
                    });
                }
            }
        });
    });

    // Lắng nghe sự kiện click vào các nút like/dislike bên trong modal
    modalBody.addEventListener('click', async (e) => {
        const voteButton = e.target.closest('.vote-button');
        if (voteButton) {
            e.preventDefault();
            const postId = voteButton.dataset.id;
            const action = voteButton.dataset.action; // 'like' hoặc 'dislike'
            
            try {
                const response = await fetch(`${API_BASE_URL}discussions/${postId}/vote/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken // Gửi CSRF token
                    },
                    body: JSON.stringify({ vote_type: action })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to cast vote: ${JSON.stringify(errorData)}`);
                }
                const updatedPost = await response.json(); // Lấy bài viết đã cập nhật từ API

                // Cập nhật localStorage để mô phỏng trạng thái vote của người dùng trên trình duyệt này
                localStorage.setItem(`post-vote-${postId}`, action);

                // Cập nhật giao diện modal
                const likeCountElement = modalBody.querySelector('.like-count');
                const dislikeCountElement = modalBody.querySelector('.dislike-count');
                likeCountElement.textContent = updatedPost.likes;
                dislikeCountElement.textContent = updatedPost.dislikes;
                
                // Cập nhật class để đổi màu nút
                modalBody.querySelectorAll('.vote-button').forEach(btn => {
                    btn.classList.remove('liked', 'disliked');
                });
                voteButton.classList.add(action === 'like' ? 'liked' : 'disliked');
                
                // Cập nhật UI trên danh sách chính (để số like/dislike trên card cũng thay đổi)
                await fetchDiscussions();
            } catch (error) {
                console.error('Lỗi khi vote:', error);
                alert("Đã xảy ra lỗi khi vote. Vui lòng thử lại.");
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

    newPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        // Lấy các tag từ input và lọc bỏ các tag rỗng
        const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const image = document.getElementById('post-image').value;
        const video = document.getElementById('post-video').value;
        const countryName = countrySelect.value; // Lấy tên quốc gia từ select

        const newPostData = {
            title: title,
            description: content.substring(0, 100) + '...',
            image_url: image || 'https://placehold.co/250x150', // Sử dụng image_url và placeholder nếu không có
            video_url: video,
            content: content,
            tags: tags, // Gửi mảng tên tag (backend sẽ xử lý tạo/lấy tag)
            country: countryName // Gửi tên quốc gia (backend sẽ xử lý tạo/lấy quốc gia)
        };

        try {
            const response = await fetch(`${API_BASE_URL}discussions/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken // Gửi CSRF token
                },
                body: JSON.stringify(newPostData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to post discussion: ${JSON.stringify(errorData)}`);
            }
            
            newPostForm.reset();
            newPostModal.style.display = 'none';
            
            await fetchDiscussions(); // Tải lại danh sách bài thảo luận từ backend
            document.querySelector('[data-page="discussions"]').click(); // Chuyển đến trang thảo luận
        } catch (error) {
            console.error("Lỗi khi đăng bài: ", error);
            alert("Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại."); // Sử dụng alert tạm thời, nên thay bằng modal tùy chỉnh
        }
    });

});
