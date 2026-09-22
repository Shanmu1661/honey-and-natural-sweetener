/**
 * AMBER & OAK - STORAGE & STATE MANAGER (storage.js)
 * Centralized local storage handling and seed data initialization
 */

const StorageManager = {
  KEYS: {
    THEME: 'amber_oak_theme',
    DIRECTION: 'amber_oak_direction',
    CART: 'amber_oak_cart',
    WISHLIST: 'amber_oak_wishlist',
    USER: 'amber_oak_user',
    PASSWORD: 'amber_oak_user_password',
    PRODUCTS: 'amber_oak_products'
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      try {
        return JSON.parse(item);
      } catch (e) {
        return item;
      }
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`Error setting localStorage key "${key}":`, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
      return false;
    }
  },

  emit(eventName, detail = {}) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  },

  on(eventName, callback) {
    window.addEventListener(eventName, callback);
  },

  getUser() {
    const defaultUser = {
      firstName: 'Eleanor',
      lastName: 'Vance',
      email: 'eleanor.vance@example.com',
      phone: '+1 (555) 234-8921',
      avatar: '../assets/images/testimonials/customer-1.jpg',
      tier: 'Gold Forager'
    };
    const stored = this.get(this.KEYS.USER, null);
    if (!stored) {
      this.set(this.KEYS.USER, defaultUser);
      return defaultUser;
    }
    return { ...defaultUser, ...stored };
  },

  setUser(userData) {
    const current = this.getUser();
    const updated = { ...current, ...userData };
    this.set(this.KEYS.USER, updated);
    this.emit('user:updated', updated);
    return updated;
  },

  getPassword() {
    const pass = this.get(this.KEYS.PASSWORD, null);
    if (!pass) {
      this.set(this.KEYS.PASSWORD, 'password123');
      return 'password123';
    }
    return pass;
  },

  setPassword(newPassword) {
    return this.set(this.KEYS.PASSWORD, newPassword);
  }
};

// Expose globally
window.StorageManager = StorageManager;
