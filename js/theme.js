/**
 * AMBER & OAK - THEME MANAGER (theme.js)
 * Light / Dark Mode Toggle with localStorage persistence
 */

(function() {
  const THEME_KEY = 'amber_oak_theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update all theme toggle button icons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'fas fa-sun';
          btn.setAttribute('title', 'Switch to Light Mode');
          btn.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
          icon.className = 'fas fa-moon';
          btn.setAttribute('title', 'Switch to Dark Mode');
          btn.setAttribute('aria-label', 'Switch to Dark Mode');
        }
      }
    });

    // Update any standalone logo images (e.g. footer)
    document.querySelectorAll('.site-footer img, .site-navbar img:not(.brand-logo-light):not(.brand-logo-dark)').forEach(img => {
      if (img.src.includes('logo')) {
        img.src = theme === 'dark'
          ? img.src.replace('logo.svg', 'logo-dark.svg')
          : img.src.replace('logo-dark.svg', 'logo.svg');
      }
    });

    if (window.StorageManager) {
      window.StorageManager.emit('theme:changed', { theme });
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // Immediate execution to prevent flash of wrong theme
  const initialTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);
  document.documentElement.setAttribute('data-bs-theme', initialTheme);

  // Setup DOM listeners once ready
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(initialTheme);
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });
  });

  window.ThemeManager = {
    getTheme: () => document.documentElement.getAttribute('data-theme'),
    setTheme: applyTheme,
    toggleTheme: toggleTheme
  };
})();
