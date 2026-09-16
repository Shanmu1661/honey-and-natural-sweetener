/**
 * AMBER & OAK - FORMS & INTERACTION HELPER (forms.js)
 * Form validation, bulk gifting calculator, and toast notifications
 */

const FormsHelper = {
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container-custom');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container-custom';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `honey-toast ${type}`;

    let icon = 'fa-info-circle text-amber';
    if (type === 'success') icon = 'fa-check-circle text-success';
    if (type === 'error') icon = 'fa-exclamation-circle text-danger';

    toast.innerHTML = `
      <i class="fas ${icon} fa-lg"></i>
      <div class="small fw-semibold flex-grow-1">${message}</div>
      <button class="btn-close btn-close-sm" style="font-size: 0.65rem;" onclick="this.parentElement.remove()"></button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, 3800);
  },

  calculateBulkPrice(qty, hasDipper, hasCustomLid) {
    const baseJar = 22.00;
    const dipperCost = hasDipper ? 1.50 : 0;
    const lidCost = hasCustomLid ? 2.00 : 0;
    const unitGross = baseJar + dipperCost + lidCost;

    let discountRate = 0;
    if (qty >= 500) discountRate = 0.30;
    else if (qty >= 150) discountRate = 0.20;
    else if (qty >= 50) discountRate = 0.10;

    const unitNet = unitGross * (1 - discountRate);
    const subtotal = unitGross * qty;
    const savings = subtotal * discountRate;
    const total = subtotal - savings;

    return {
      qty,
      unitGross: unitGross.toFixed(2),
      discountRate: (discountRate * 100).toFixed(0),
      unitNet: unitNet.toFixed(2),
      subtotal: subtotal.toFixed(2),
      savings: savings.toFixed(2),
      total: total.toFixed(2)
    };
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Bulk Gifting Interactive Calculator
  const bulkQtyInput = document.getElementById('bulk-qty-input');
  const bulkDipperCheck = document.getElementById('bulk-dipper-check');
  const bulkLidCheck = document.getElementById('bulk-lid-check');

  function updateBulkCalc() {
    if (!bulkQtyInput) return;
    const qty = Math.max(25, parseInt(bulkQtyInput.value) || 25);
    const hasDipper = bulkDipperCheck ? bulkDipperCheck.checked : false;
    const hasLid = bulkLidCheck ? bulkLidCheck.checked : false;

    const res = FormsHelper.calculateBulkPrice(qty, hasDipper, hasCustomLid = hasLid);

    const unitNetEl = document.getElementById('calc-unit-price');
    const discountEl = document.getElementById('calc-discount-tier');
    const savingsEl = document.getElementById('calc-total-savings');
    const totalEl = document.getElementById('calc-estimated-total');

    if (unitNetEl) unitNetEl.textContent = `$${res.unitNet}`;
    if (discountEl) discountEl.textContent = `${res.discountRate}% Volume Savings`;
    if (savingsEl) savingsEl.textContent = `Saved: $${res.savings}`;
    if (totalEl) totalEl.textContent = `$${res.total}`;
  }

  if (bulkQtyInput) {
    bulkQtyInput.addEventListener('input', updateBulkCalc);
    if (bulkDipperCheck) bulkDipperCheck.addEventListener('change', updateBulkCalc);
    if (bulkLidCheck) bulkLidCheck.addEventListener('change', updateBulkCalc);
    updateBulkCalc();
  }

  // 2. Contact Enquiry Form submission
  const contactForm = document.getElementById('contact-enquiry-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      const name = contactForm.querySelector('[name="name"]')?.value || 'Guest';
      FormsHelper.showToast(`Thank you, ${name}! Your enquiry has been routed to our apiary team. We will reply within 24 hours.`, 'success');
      contactForm.reset();
    });
  }

  // 3. Newsletter Form
  document.querySelectorAll('.newsletter-subscribe-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        FormsHelper.showToast(`Subscribed! Enjoy 10% off with coupon code RAW10`, 'success');
        emailInput.value = '';
      }
    });
  });

  // 4. Coupon Form in Cart
  const couponForm = document.getElementById('cart-coupon-form');
  if (couponForm) {
    couponForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('cart-coupon-input');
      if (input && window.CartController) {
        window.CartController.applyCoupon(input.value);
      }
    });
  }

  // 5. Checkout Form
  const checkoutForm = document.getElementById('checkout-order-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!checkoutForm.checkValidity()) {
        checkoutForm.reportValidity();
        return;
      }

      FormsHelper.showToast('Order placed successfully! Redirecting to tracking...', 'success');
      if (window.CartController) {
        // Clear cart after placement
        StorageManager.set(StorageManager.KEYS.CART, []);
        window.CartController.updateUI();
      }

      setTimeout(() => {
        window.location.href = 'user-dashboard/orders.html';
      }, 1500);
    });
  }
});

window.FormsHelper = FormsHelper;
