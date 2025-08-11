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
});