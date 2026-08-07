document.addEventListener('DOMContentLoaded', () => {
  initDashboardSidebar();
});

async function initDashboardSidebar() {
  const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
  
  if (sidebarPlaceholder) {
    try {
      const resp = await fetch('../assets/components/sidebar.html');
      if (resp.ok) {
        sidebarPlaceholder.outerHTML = await resp.text();
        highlightDashboardNav();
        bindSidebarToggle();
      }
    } catch (e) {
      console.error('Error loading sidebar:', e);
    }
  } else {
    highlightDashboardNav();
    bindSidebarToggle();
  }
}

function highlightDashboardNav() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.sidebar-menu a');
  
  links.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (currentPath.includes(linkPath)) {
      link.classList.add('active');
    }
  });
}

function bindSidebarToggle() {
  const toggleBtn = document.querySelector('.sidebar-toggle-btn');
  const sidebar = document.querySelector('.dashboard-sidebar');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}
