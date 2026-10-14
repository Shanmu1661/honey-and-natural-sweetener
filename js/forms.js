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
  },

  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = isPass ? 'fas fa-eye-slash' : 'fas fa-eye';
    }
  },

  initUserProfile() {
    if (!window.StorageManager) return;
    const user = StorageManager.getUser();

    // 1. Update sidebars and headers with active user profile
    document.querySelectorAll('.user-profile-summary').forEach(summary => {
      const nameEl = summary.querySelector('h5');
      const emailEl = summary.querySelector('p');
      const avatarEl = summary.querySelector('.user-avatar-img');
      const tierEl = summary.querySelector('.badge');

      if (nameEl) nameEl.textContent = `${user.firstName} ${user.lastName}`.trim();
      if (emailEl) emailEl.textContent = user.email;
      if (avatarEl && user.avatar) {
        avatarEl.src = user.avatar;
        avatarEl.alt = `${user.firstName} ${user.lastName}`.trim();
      }
      if (tierEl && user.tier) tierEl.textContent = user.tier;
    });

    // 2. Populate profile form fields if on profile page
    const profileForm = document.getElementById('profile-update-form');
    if (profileForm) {
      const fnInput = profileForm.querySelector('#profileFirstName') || profileForm.querySelector('input[name="firstName"]') || profileForm.querySelectorAll('input[type="text"]')[0];
      const lnInput = profileForm.querySelector('#profileLastName') || profileForm.querySelector('input[name="lastName"]') || profileForm.querySelectorAll('input[type="text"]')[1];
      const emInput = profileForm.querySelector('#profileEmail') || profileForm.querySelector('input[type="email"]');
      const phInput = profileForm.querySelector('#profilePhone') || profileForm.querySelector('input[type="tel"]');
      const avInput = profileForm.querySelector('#avatar-input');
      const avPrev = document.getElementById('user-avatar-preview');

      if (fnInput && user.firstName) fnInput.value = user.firstName;
      if (lnInput && user.lastName) lnInput.value = user.lastName;
      if (emInput && user.email) emInput.value = user.email;
      if (phInput && user.phone) phInput.value = user.phone;
      if (avInput && user.avatar) avInput.value = user.avatar;
      if (avPrev && user.avatar) avPrev.src = user.avatar;
    }
  },

  handleProfileUpdate(e, form) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const targetForm = form || (e && e.target ? (e.target.tagName === 'FORM' ? e.target : e.target.closest('form')) : null) || document.getElementById('profile-update-form');
    if (!targetForm) return false;

    const fnInput = targetForm.querySelector('#profileFirstName') || targetForm.querySelectorAll('input[type="text"]')[0];
    const lnInput = targetForm.querySelector('#profileLastName') || targetForm.querySelectorAll('input[type="text"]')[1];
    const emInput = targetForm.querySelector('#profileEmail') || targetForm.querySelector('input[type="email"]');
    const phInput = targetForm.querySelector('#profilePhone') || targetForm.querySelector('input[type="tel"]');
    const avInput = targetForm.querySelector('#avatar-input');

    const firstName = fnInput ? fnInput.value.trim() : '';
    const lastName = lnInput ? lnInput.value.trim() : '';
    const email = emInput ? emInput.value.trim() : '';
    const phone = phInput ? phInput.value.trim() : '';
    const avatar = avInput ? avInput.value.trim() : '';

    if (!firstName) {
      FormsHelper.showToast('Please enter your first name.', 'error');
      if (fnInput) fnInput.focus();
      return false;
    }

    if (!email) {
      FormsHelper.showToast('Please enter a valid email address.', 'error');
      if (emInput) emInput.focus();
      return false;
    }

    if (window.StorageManager) {
      StorageManager.setUser({
        firstName,
        lastName,
        email,
        phone,
        avatar: avatar || '../assets/images/testimonials/customer-1.jpg'
      });
    }

    FormsHelper.initUserProfile();
    FormsHelper.showToast('Profile information successfully saved and updated!', 'success');
    return false;
  },

  handleLogin(e, form) {
    if (e && e.preventDefault) e.preventDefault();
    const targetForm = form || (e && e.target ? (e.target.tagName === 'FORM' ? e.target : e.target.closest('form')) : null);
    if (!targetForm) return false;

    const emailInput = targetForm.querySelector('input[type="email"]');
    const passInput = targetForm.querySelector('input[type="password"]');
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const passVal = passInput ? passInput.value : '';

    const storedPass = window.StorageManager ? StorageManager.getPassword() : 'password123';
    const user = window.StorageManager ? StorageManager.getUser() : null;

    if (!emailVal) {
      FormsHelper.showToast('Please enter your email address.', 'error');
      if (emailInput) emailInput.focus();
      return false;
    }

    if (!passVal) {
      FormsHelper.showToast('Please enter your password.', 'error');
      if (passInput) passInput.focus();
      return false;
    }

    if (passVal !== storedPass) {
      FormsHelper.showToast('Incorrect email or password. Please verify your credentials.', 'error');
      if (passInput) passInput.focus();
      return false;
    }

    if (user && emailVal && user.email !== emailVal && window.StorageManager) {
      StorageManager.setUser({ email: emailVal });
    }

    FormsHelper.showToast('Signing in to your account...', 'success');
    setTimeout(() => {
      window.location.href = 'user-dashboard/index.html';
    }, 800);
    return false;
  },

  handleRegister(e, form) {
    if (e && e.preventDefault) e.preventDefault();
    const targetForm = form || (e && e.target ? (e.target.tagName === 'FORM' ? e.target : e.target.closest('form')) : null);
    if (!targetForm) return false;

    const nameInput = targetForm.querySelector('input[type="text"]');
    const emailInput = targetForm.querySelector('input[type="email"]');
    const passInput = targetForm.querySelector('#regPassword') || targetForm.querySelectorAll('input[type="password"]')[0];
    const confirmInput = targetForm.querySelector('#regConfirmPassword') || targetForm.querySelectorAll('input[type="password"]')[1];

    const fullName = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const passVal = passInput ? passInput.value : '';
    const confirmVal = confirmInput ? confirmInput.value : '';

    if (!fullName) {
      FormsHelper.showToast('Please enter your full name.', 'error');
      if (nameInput) nameInput.focus();
      return false;
    }

    if (!emailVal) {
      FormsHelper.showToast('Please enter your email address.', 'error');
      if (emailInput) emailInput.focus();
      return false;
    }

    if (!passVal || passVal.length < 6) {
      FormsHelper.showToast('Password must be at least 6 characters long.', 'error');
      if (passInput) passInput.focus();
      return false;
    }

    if (passVal !== confirmVal) {
      FormsHelper.showToast('Passwords do not match. Please verify.', 'error');
      if (confirmInput) confirmInput.focus();
      return false;
    }

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || 'Member';
    const lastName = nameParts.slice(1).join(' ') || '';

    if (window.StorageManager) {
      StorageManager.setUser({
        firstName,
        lastName,
        email: emailVal,
        phone: '',
        avatar: '../assets/images/testimonials/customer-1.jpg',
        tier: 'Member'
      });
      StorageManager.setPassword(passVal);
    }

    FormsHelper.showToast(`Welcome to Amber & Oak, ${firstName}! Account created.`, 'success');
    setTimeout(() => {
      window.location.href = 'user-dashboard/index.html';
    }, 900);
    return false;
  },

  handlePasswordUpdate(e, form) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    }
    const targetForm = form || (e && e.target ? (e.target.tagName === 'FORM' ? e.target : e.target.closest('form')) : null) || document.getElementById('password-update-form');
    if (!targetForm) return false;

    const currentInput = targetForm.querySelector('#currentPassword') || document.getElementById('currentPassword');
    const newInput = targetForm.querySelector('#newPassword') || document.getElementById('newPassword');
    const confirmInput = targetForm.querySelector('#confirmPassword') || document.getElementById('confirmPassword');

    const currentFeedback = targetForm.querySelector('#currentPasswordFeedback') || document.getElementById('currentPasswordFeedback');
    const newFeedback = targetForm.querySelector('#newPasswordFeedback') || document.getElementById('newPasswordFeedback');
    const confirmFeedback = targetForm.querySelector('#confirmPasswordFeedback') || document.getElementById('confirmPasswordFeedback');

    // Reset styles
    [currentInput, newInput, confirmInput].forEach(inp => {
      if (inp) {
        inp.classList.remove('is-invalid', 'is-valid');
      }
    });

    const currentVal = currentInput ? currentInput.value.trim() : '';
    const newVal = newInput ? newInput.value.trim() : '';
    const confirmVal = confirmInput ? confirmInput.value.trim() : '';

    const storedPassword = (window.StorageManager && StorageManager.getPassword()) || 'password123';

    // 1. Verify current password
    if (!currentVal) {
      if (currentInput) currentInput.classList.add('is-invalid');
      if (currentFeedback) currentFeedback.textContent = 'Please enter your current password.';
      FormsHelper.showToast('Please enter your current password.', 'error');
      if (currentInput) currentInput.focus();
      return false;
    }

    if (currentVal !== storedPassword) {
      if (currentInput) currentInput.classList.add('is-invalid');
      if (currentFeedback) currentFeedback.textContent = 'Current password does not match our records.';
      FormsHelper.showToast('Current password does not match our records. Please verify.', 'error');
      if (currentInput) currentInput.focus();
      return false;
    } else {
      if (currentInput) currentInput.classList.add('is-valid');
    }

    // 2. Verify new password minimum length
    if (!newVal || newVal.length < 6) {
      if (newInput) newInput.classList.add('is-invalid');
      if (newFeedback) newFeedback.textContent = 'New password must be at least 6 characters long.';
      FormsHelper.showToast('New password must be at least 6 characters long.', 'error');
      if (newInput) newInput.focus();
      return false;
    } else if (newVal === storedPassword) {
      if (newInput) newInput.classList.add('is-invalid');
      if (newFeedback) newFeedback.textContent = 'New password cannot be the same as your current password.';
      FormsHelper.showToast('New password must be different from current password.', 'error');
      if (newInput) newInput.focus();
      return false;
    } else {
      if (newInput) newInput.classList.add('is-valid');
    }

    // 3. Verify password confirmation
    if (!confirmVal || newVal !== confirmVal) {
      if (confirmInput) confirmInput.classList.add('is-invalid');
      if (confirmFeedback) confirmFeedback.textContent = 'New passwords do not match.';
      FormsHelper.showToast('New passwords do not match. Please verify.', 'error');
      if (confirmInput) confirmInput.focus();
      return false;
    } else {
      if (confirmInput) confirmInput.classList.add('is-valid');
    }

    // 4. Save new password to storage
    if (window.StorageManager) {
      StorageManager.setPassword(newVal);
    }
    FormsHelper.showToast('Password successfully updated and secured!', 'success');

    targetForm.reset();
    setTimeout(() => {
      [currentInput, newInput, confirmInput].forEach(inp => {
        if (inp) inp.classList.remove('is-valid', 'is-invalid');
      });
    }, 3000);

    return false;
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

  // 6. User Profile & Password Form initialization
  FormsHelper.initUserProfile();

  const profileForm = document.getElementById('profile-update-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      FormsHelper.handleProfileUpdate(e, profileForm);
    });
  }

  const passForm = document.getElementById('password-update-form');
  if (passForm) {
    passForm.addEventListener('submit', (e) => {
      e.preventDefault();
      FormsHelper.handlePasswordUpdate(e, passForm);
    });

    const inputs = passForm.querySelectorAll('input[type="password"], input[type="text"]');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
      });
    });
  }
});

window.FormsHelper = FormsHelper;
