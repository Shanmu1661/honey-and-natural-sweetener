/**
 * AMBER & OAK - RTL LAYOUT MANAGER (rtl.js)
 * Robust RTL / LTR Direction Toggle with localStorage persistence
 */

(function() {
  const DIR_KEY = 'amber_oak_direction';

  function getStoredDirection() {
    try {
      return localStorage.getItem(DIR_KEY) || 'ltr';
    } catch (e) {
      return 'ltr';
    }
  }

  function applyDirection(dir, showToastNotification = false) {
    const isRtl = dir === 'rtl';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', isRtl ? 'ar' : 'en');
    
    try {
      localStorage.setItem(DIR_KEY, isRtl ? 'rtl' : 'ltr');
    } catch (e) {
      console.warn('Could not save direction preference:', e);
    }

    // Toggle RTL stylesheet link tag if present
    const rtlLink = document.getElementById('rtl-stylesheet');
    if (rtlLink) {
      rtlLink.disabled = !isRtl;
    }

    // Update all RTL buttons UI
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      const textSpan = btn.querySelector('.dir-text');
      if (textSpan) {
        textSpan.textContent = isRtl ? 'LTR' : 'RTL';
      }
      btn.setAttribute('title', isRtl ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)');
      btn.setAttribute('aria-label', isRtl ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
      
      if (isRtl) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (showToastNotification && window.FormsHelper && typeof window.FormsHelper.showToast === 'function') {
      const msg = isRtl ? 'Switched to RTL (Right-to-Left / العربية) mode' : 'Switched to LTR (Left-to-Right / English) mode';
      window.FormsHelper.showToast(msg, 'info');
    }

    if (window.StorageManager) {
      window.StorageManager.emit('direction:changed', { direction: isRtl ? 'rtl' : 'ltr' });
    }

    window.dispatchEvent(new CustomEvent('amber_oak_direction_changed', { detail: { direction: isRtl ? 'rtl' : 'ltr' } }));
  }

  function toggleDirection() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    applyDirection(next, true);
  }

  // Set initial direction immediately to prevent layout flickering
  const initialDir = getStoredDirection();
  document.documentElement.setAttribute('dir', initialDir);
  document.documentElement.setAttribute('lang', initialDir === 'rtl' ? 'ar' : 'en');

  // Disable stylesheet immediately if ltr
  const rtlLinkEarly = document.getElementById('rtl-stylesheet');
  if (rtlLinkEarly) {
    rtlLinkEarly.disabled = (initialDir !== 'rtl');
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyDirection(getStoredDirection());

    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDirection();
      });
    });
  });

  window.RTLManager = {
    getDirection: () => document.documentElement.getAttribute('dir') || 'ltr',
    isRTL: () => (document.documentElement.getAttribute('dir') === 'rtl'),
    setDirection: applyDirection,
    toggleDirection: toggleDirection
  };
})();
