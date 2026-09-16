/**
 * AMBER & OAK - RTL LAYOUT MANAGER (rtl.js)
 * RTL / LTR Direction Toggle with localStorage persistence
 */

(function() {
  const DIR_KEY = 'amber_oak_direction';

  function getStoredDirection() {
    return localStorage.getItem(DIR_KEY) || 'ltr';
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);

    // Toggle RTL link tag if present
    const rtlLink = document.getElementById('rtl-stylesheet');
    if (rtlLink) {
      rtlLink.disabled = (dir !== 'rtl');
    }

    // Update RTL buttons UI
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      const textSpan = btn.querySelector('.dir-text');
      if (textSpan) {
        textSpan.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    });

    if (window.StorageManager) {
      window.StorageManager.emit('direction:changed', { direction: dir });
    }
  }

  function toggleDirection() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    applyDirection(next);
  }

  // Set direction immediately
  const initialDir = getStoredDirection();
  document.documentElement.setAttribute('dir', initialDir);

  document.addEventListener('DOMContentLoaded', () => {
    applyDirection(initialDir);
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDirection();
      });
    });
  });

  window.RTLManager = {
    getDirection: () => document.documentElement.getAttribute('dir'),
    setDirection: applyDirection,
    toggleDirection: toggleDirection
  };
})();
