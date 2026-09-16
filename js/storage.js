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
    PRODUCTS: 'amber_oak_products'
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
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
  }
};

// Expose globally
window.StorageManager = StorageManager;
