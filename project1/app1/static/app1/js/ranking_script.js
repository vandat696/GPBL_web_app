document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.dataset.page;

            // Điều hướng về trang chủ (/) kèm hash
            window.location.href = `/#${pageId}`;
        });
    });
});
