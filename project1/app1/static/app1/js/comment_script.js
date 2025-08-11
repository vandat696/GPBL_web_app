document.addEventListener('DOMContentLoaded', () => {
    // Load CSRF token
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

    // Load element
    const newCommentForm = document.getElementById('new-comment-form');
    const commentInput = document.querySelector('.comment-input');
    const submitButton = document.querySelector('.submit-comment-btn');
    const commentsList = document.querySelector('.comments-list');
    const likeBtn = document.querySelector('.like-btn');
    const dislikeBtn = document.querySelector('.dislike-btn');

    // Auto-resize textarea
    if (commentInput) {
        commentInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
            
            // Enable/disable submit button based on content
            if (this.value.trim()) {
                submitButton.disabled = false;
            } else {
                submitButton.disabled = true;
            }
        });
    }

    // Handle submit comment
    if (newCommentForm) {
        newCommentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(newCommentForm);
            const commentText = formData.get('body').trim();
            
            if (!commentText) {
                alert('コメントを入力してください。');
                return;
            }
            
            // Disable submit button temporarily
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            try {
                const response = await fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken,
                    },
                    body: formData,
                });
                
                if (response.ok) {

                    addNewCommentToList(commentText);
                    
                    // Reset form and textarea
                    newCommentForm.reset();
                    commentInput.style.height = 'auto';

                    // Update comment count
                    updateCommentCount(1);
                    
                    // Show success message briefly
                    showNotification('コメントが投稿されました！', 'success');
                } else {
                    throw new Error('コメントの投稿に失敗しました。');
                }
            } catch (error) {
                console.error('Error posting comment:', error);
                showNotification('コメントの投稿中にエラーが発生しました。', 'error');
            } finally {
                // Reset submit button
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
            }
        });
    }

    // add new comment to the list
    function addNewCommentToList(commentText) {
        // Remove "no comments" message if exists
        const noCommentsDiv = document.querySelector('.no-comments');
        if (noCommentsDiv) {
            noCommentsDiv.remove();
        }
        
        // Tạo element comment mới
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
            <div class="comment-content">
                <div class="comment-author">あなた</div>
                <div class="comment-text">${commentText}</div>
            </div>
        `;

        // Add new comment to the beginning of the list
        commentsList.insertBefore(commentItem, commentsList.firstChild);

        // Scroll to new comment
        commentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Update comment count
    function updateCommentCount(increment) {
        const commentCountBtn = document.querySelector('.comment-count');
        if (commentCountBtn) {
            const currentText = commentCountBtn.textContent;
            const match = currentText.match(/\((\d+)\)/);
            if (match) {
                const currentCount = parseInt(match[1]);
                const newCount = currentCount + increment;
                commentCountBtn.innerHTML = `<i class="fas fa-comment"></i> コメント (${newCount})`;
            }
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add CSS for notification
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 3000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Handle like/dislike button
    if (likeBtn) {
        likeBtn.addEventListener('click', async () => {
            const articleId = likeBtn.dataset.articleId;
            await handleLikeDislike(articleId, 'like');
        });
    }

    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', async () => {
            const articleId = dislikeBtn.dataset.articleId;
            await handleLikeDislike(articleId, 'dislike');
        });
    }

    // Handle like/dislike
    async function handleLikeDislike(articleId, action) {
        try {
            const response = await fetch(`/${action}/add/${articleId}/`, {
                method: 'GET',
                headers: {
                    'X-CSRFToken': csrftoken,
                },
            });
            
            if (response.ok) {
                // Update UI (can reload page or update count)
                const button = action === 'like' ? likeBtn : dislikeBtn;
                const currentText = button.textContent;
                const match = currentText.match(/\((\d+)\)/);
                if (match) {
                    const currentCount = parseInt(match[1]);
                    const newCount = currentCount + 1;
                    const icon = action === 'like' ? 'thumbs-up' : 'thumbs-down';
                    const label = action === 'like' ? '高評価' : '低評価';
                    button.innerHTML = `<i class="fas fa-${icon}"></i> ${label} (${newCount})`;
                }
                
                showNotification(action === 'like' ? '高評価しました！' : '低評価しました！', 'success');
            }
        } catch (error) {
            console.error('Error handling like/dislike:', error);
            showNotification('エラーが発生しました。', 'error');
        }
    }

    // Handle modal close when pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            history.back();
        }
    });

    // Handle click outside modal to close
    const modalBackdrop = document.querySelector('.comment-modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                history.back();
            }
        });
    }

    // Focus on textarea when opening modal
    setTimeout(() => {
        if (commentInput) {
            commentInput.focus();
        }
    }, 300);

    // Handle paste image (optional - can be added later)
    if (commentInput) {
        commentInput.addEventListener('paste', (e) => {
            const items = e.clipboardData.items;
            for (let item of items) {
                if (item.type.indexOf('image') !== -1) {
                    // Image upload feature can be implemented later
                    console.log('Image pasted - feature can be implemented later');
                }
            }
        });
    }
});