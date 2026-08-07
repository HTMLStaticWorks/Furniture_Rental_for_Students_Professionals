document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initComponents().then(() => {
    // Re-initialize scripts that depend on loaded DOM (like header/footer)
    initMobileMenu();
    initStickyHeader();
    highlightActivePage();
  });
  initAnimations();
});

// --- Theme Toggle ---
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle') || document.querySelector('.theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const savedTheme = localStorage.getItem('rentnest-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // If themeToggle isn't present initially, we'll re-bind it after header injects
  bindThemeToggle();
}

function bindThemeToggle() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('rentnest-theme', newTheme);
    });
  });
}

// --- RTL Toggle ---
function initRTL() {
  const savedRTL = localStorage.getItem('rentnest-rtl');
  if (savedRTL === 'true') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.removeAttribute('dir');
  }

  bindRTLToggle();
}

function bindRTLToggle() {
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      if (isRTL) {
        document.documentElement.removeAttribute('dir');
        localStorage.setItem('rentnest-rtl', 'false');
      } else {
        document.documentElement.setAttribute('dir', 'rtl');
        localStorage.setItem('rentnest-rtl', 'true');
      }
    });
  });
}

// --- Dynamic Component Loading ---
async function initComponents() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  const basePath = getBasePath();

  if (headerPlaceholder) {
    try {
      const resp = await fetch(basePath + 'assets/components/header.html');
      if (resp.ok) {
        headerPlaceholder.outerHTML = await resp.text();
      }
    } catch (e) {
      console.error('Error loading header:', e);
    }
  }

  if (footerPlaceholder) {
    try {
      const resp = await fetch(basePath + 'assets/components/footer.html');
      if (resp.ok) {
        footerPlaceholder.outerHTML = await resp.text();
      }
    } catch (e) {
      console.error('Error loading footer:', e);
    }
  }
}

function getBasePath() {
  // Simple check to determine if we are in dashboard folder
  if (window.location.pathname.includes('/dashboard/')) {
    return '../';
  }
  return '';
}

// --- Mobile Menu ---
function initMobileMenu() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navContainer = document.querySelector('.nav-container');
  const navLinks = document.querySelector('.nav-links');
  const navActions = document.querySelector('.nav-actions');

  if (mobileBtn && navContainer) {
    mobileBtn.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
      navContainer.classList.toggle('mobile-active');
      if(navLinks) navLinks.classList.toggle('mobile-active');
      if(navActions) navActions.classList.toggle('mobile-active');
    });
  }
}

// --- Sticky Header ---
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

// --- Active Page Highlighting ---
function highlightActivePage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    // Basic exact match or matching pathname, ignoring query strings
    const linkPath = new URL(link.href).pathname;
    // Special handling for index.html at root
    if (currentPath === '/' || currentPath.endsWith('index.html')) {
        if (linkPath.endsWith('index.html') || linkPath === '/') {
           link.classList.add('active');
        }
    } else if (currentPath.includes(linkPath) && linkPath !== '/') {
        link.classList.add('active');
    }
  });
}

// --- Intersection Observer Animations ---
function initAnimations() {
  const animatedElements = document.querySelectorAll('.animate');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optional: remove observer after animation completes if we only want it once
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  animatedElements.forEach(el => observer.observe(el));
}
