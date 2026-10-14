/**
 * AMBER & OAK - CART CONTROLLER (cart.js)
 * Interactive shopping cart state, drawer, and price calculation
 */

const CartController = {
  getCart() {
    return StorageManager.get(StorageManager.KEYS.CART, [
      {
        id: "prod-1",
        name: "Wild Alpine Meadow Honey",
        price: 24.50,
        size: "500g",
        quantity: 1,
        image: "assets/images/products/wildflower-honey.jpg"
      },
      {
        id: "prod-4",
        name: "Artisan Raw Honeycomb Slab",
        price: 36.50,
        size: "350g Slab",
        quantity: 1,
        image: "assets/images/products/raw-comb-honey.jpg"
      }
    ]);
  },

  saveCart(cart) {
    StorageManager.set(StorageManager.KEYS.CART, cart);
    this.updateUI();
    StorageManager.emit('cart:updated', { cart });
  },

  addItem(item, quantity = 1, size = '500g') {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(i => i.id === item.id && i.size === size);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        size: size,
        quantity: Number(quantity),
        image: item.image || 'assets/images/products/wildflower-honey.jpg'
      });
    }

    this.saveCart(cart);
    if (window.FormsHelper) {
      window.FormsHelper.showToast(`Added ${item.name} (${size}) to cart!`, 'success');
    }
    this.openDrawer();
  },

  removeItem(id, size) {
    let cart = this.getCart();
    cart = cart.filter(i => !(i.id === id && i.size === size));
    this.saveCart(cart);
  },

  updateQuantity(id, size, newQty) {
    let cart = this.getCart();
    const index = cart.findIndex(i => i.id === id && i.size === size);
    if (index > -1) {
      if (newQty <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = newQty;
      }
      this.saveCart(cart);
    }
  },

  getTotals() {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountCode = StorageManager.get('amber_oak_coupon', null);
    let discount = 0;
    if (discountCode === 'HONEY10') discount = subtotal * 0.10;
    if (discountCode === 'RAW20') discount = subtotal * 0.20;

    const shipping = subtotal > 75 || subtotal === 0 ? 0.00 : 7.50;
    const total = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      discountCode
    };
  },

  applyCoupon(code) {
    const trimmed = (code || '').trim().toUpperCase();
    if (trimmed === 'HONEY10' || trimmed === 'RAW20') {
      StorageManager.set('amber_oak_coupon', trimmed);
      this.updateUI();
      if (window.FormsHelper) {
        window.FormsHelper.showToast(`Coupon ${trimmed} applied successfully!`, 'success');
      }
      return true;
    } else {
      if (window.FormsHelper) {
        window.FormsHelper.showToast(`Invalid coupon code. Try HONEY10 or RAW20.`, 'error');
      }
      return false;
    }
  },

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  updateUI() {
    const totals = this.getTotals();
    const cart = this.getCart();

    // 1. Update all badge counters
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = totals.itemCount;
      badge.style.display = totals.itemCount > 0 ? 'flex' : 'none';
    });

    // 2. Render Drawer content
    const drawerItemsContainer = document.getElementById('cart-drawer-items');
    const drawerSubtotal = document.getElementById('cart-drawer-subtotal');
    if (drawerItemsContainer) {
      if (cart.length === 0) {
        drawerItemsContainer.innerHTML = `
          <div class="text-center py-5">
            <i class="fas fa-shopping-basket fa-3x text-muted mb-3"></i>
            <h5>Your cart is currently empty</h5>
            <p class="text-muted small">Explore our pure wildflower & forest honeys</p>
            <a href="products.html" class="btn btn-honey btn-sm mt-2">Browse Honeys</a>
          </div>
        `;
      } else {
        drawerItemsContainer.innerHTML = cart.map(item => `
          <div class="cart-item-row">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="flex-grow-1">
              <h6 class="mb-1 text-truncate" style="max-width: 180px;">${item.name}</h6>
              <div class="small text-muted mb-2">Size: ${item.size}</div>
              <div class="d-flex align-items-center justify-content-between">
                <div class="input-group input-group-sm" style="width: 90px;">
                  <button class="btn btn-outline-secondary px-2" onclick="CartController.updateQuantity('${item.id}', '${item.size}', ${item.quantity - 1})">-</button>
                  <span class="input-group-text bg-white px-2">${item.quantity}</span>
                  <button class="btn btn-outline-secondary px-2" onclick="CartController.updateQuantity('${item.id}', '${item.size}', ${item.quantity + 1})">+</button>
                </div>
                <div class="fw-bold text-amber">$${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
            <button class="btn btn-sm text-danger align-self-start border-0 bg-transparent" onclick="CartController.removeItem('${item.id}', '${item.size}')">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        `).join('');
      }
    }
    if (drawerSubtotal) {
      drawerSubtotal.textContent = `$${totals.subtotal}`;
    }

    // 3. Render Cart Page table if present
    const cartPageTable = document.getElementById('cart-page-table-body');
    if (cartPageTable) {
      if (cart.length === 0) {
        cartPageTable.innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-5">
              <h4>Your Shopping Cart is Empty</h4>
              <p class="text-muted">Start filling your pantry with raw artisanal honey!</p>
              <a href="products.html" class="btn btn-honey mt-2">Explore Catalog</a>
            </td>
          </tr>
        `;
      } else {
        cartPageTable.innerHTML = cart.map(item => `
          <tr>
            <td>
              <div class="d-flex align-items-center gap-3">
                <img src="${item.image}" alt="${item.name}" class="rounded" style="width: 64px; height: 64px; object-fit: cover;">
                <div>
                  <h6 class="mb-0">${item.name}</h6>
                  <span class="badge bg-light text-dark">Size: ${item.size}</span>
                </div>
              </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
              <div class="input-group input-group-sm" style="width: 100px;">
                <button class="btn btn-outline-secondary" onclick="CartController.updateQuantity('${item.id}', '${item.size}', ${item.quantity - 1})">-</button>
                <span class="input-group-text bg-white text-center flex-grow-1">${item.quantity}</span>
                <button class="btn btn-outline-secondary" onclick="CartController.updateQuantity('${item.id}', '${item.size}', ${item.quantity + 1})">+</button>
              </div>
            </td>
            <td class="fw-bold text-amber">$${(item.price * item.quantity).toFixed(2)}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-danger" onclick="CartController.removeItem('${item.id}', '${item.size}')">
                <i class="fas fa-times"></i>
              </button>
            </td>
          </tr>
        `).join('');
      }
    }

    // Update cart totals across summary cards
    document.querySelectorAll('.summary-subtotal').forEach(el => el.textContent = `$${totals.subtotal}`);
    document.querySelectorAll('.summary-shipping').forEach(el => el.textContent = totals.shipping === '0.00' ? 'FREE' : `$${totals.shipping}`);
    document.querySelectorAll('.summary-discount').forEach(el => el.textContent = `-$${totals.discount}`);
    document.querySelectorAll('.summary-total').forEach(el => el.textContent = `$${totals.total}`);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CartController.updateUI();

  // Bind Drawer open/close buttons
  document.querySelectorAll('.cart-drawer-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      CartController.openDrawer();
    });
  });

  document.querySelectorAll('.cart-drawer-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      CartController.closeDrawer();
    });
  });

  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => CartController.closeDrawer());
  }
});

window.CartController = CartController;
