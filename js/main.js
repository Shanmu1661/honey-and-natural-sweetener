/**
 * AMBER & OAK - MAIN APPLICATION SCRIPT (main.js)
 * Global UI initialization, sticky headers, countdown timer, back to top
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Header
  const navbar = document.querySelector('.site-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 2. Back to Top Button
  let btt = document.getElementById('back-to-top');
  if (!btt) {
    btt = document.createElement('button');
    btt.id = 'back-to-top';
    btt.className = 'btn btn-honey rounded-circle position-fixed shadow-lg';
    btt.style.cssText = 'bottom: 25px; right: 25px; width: 45px; height: 45px; z-index: 999; display: none; align-items: center; justify-content: center;';
    btt.innerHTML = '<i class="fas fa-chevron-up"></i>';
    btt.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btt);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btt.style.display = 'flex';
    } else {
      btt.style.display = 'none';
    }
  });

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 3. Coming Soon Countdown Timer
  const countdownEl = document.getElementById('launch-countdown');
  if (countdownEl) {
    const launchDate = new Date().getTime() + (45 * 24 * 60 * 60 * 1000); // 45 days from now

    function updateTimer() {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) return;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const dEl = document.getElementById('countdown-days');
      const hEl = document.getElementById('countdown-hours');
      const mEl = document.getElementById('countdown-minutes');
      const sEl = document.getElementById('countdown-seconds');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    }

    setInterval(updateTimer, 1000);
    updateTimer();
  }

  // 4. Quantity Stepper on Product Details Page
  const qtyInput = document.getElementById('product-detail-qty');
  const qtyPlus = document.getElementById('qty-plus-btn');
  const qtyMinus = document.getElementById('qty-minus-btn');

  if (qtyInput && qtyPlus && qtyMinus) {
    qtyPlus.addEventListener('click', () => {
      qtyInput.value = parseInt(qtyInput.value || 1) + 1;
    });
    qtyMinus.addEventListener('click', () => {
      const current = parseInt(qtyInput.value || 1);
      if (current > 1) qtyInput.value = current - 1;
    });
  }

  // 5. Size Selection Pill highlight on Product Details
  document.querySelectorAll('.size-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-select-btn').forEach(b => b.classList.remove('btn-honey', 'active'));
      document.querySelectorAll('.size-select-btn').forEach(b => b.classList.add('btn-outline-secondary'));
      btn.classList.remove('btn-outline-secondary');
      btn.classList.add('btn-honey', 'active');
    });
  });

  // 6. Admin Sidebar Mobile Toggle
  const adminToggle = document.getElementById('admin-sidebar-toggle');
  const adminSidebar = document.querySelector('.admin-sidebar');
  if (adminToggle && adminSidebar) {
    adminToggle.addEventListener('click', () => {
      adminSidebar.classList.toggle('open');
    });
  }
});
