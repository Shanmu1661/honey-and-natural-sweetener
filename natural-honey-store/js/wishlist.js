/**
 * AMBER & OAK - WISHLIST CONTROLLER (wishlist.js)
 * User favorite items, heart icon synchronization, and move to cart
 */

const WishlistController = {
  getWishlist() {
    return StorageManager.get(StorageManager.KEYS.WISHLIST, ['prod-1', 'prod-3']);
  },

  saveWishlist(list) {
    StorageManager.set(StorageManager.KEYS.WISHLIST, list);
    this.updateUI();
    StorageManager.emit('wishlist:updated', { wishlist: list });
  },

  toggle(productId) {
    const list = this.getWishlist();
    const index = list.indexOf(productId);
    let isAdded = false;

    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(productId);
      isAdded = true;
    }

    this.saveWishlist(list);

    if (window.FormsHelper) {
      window.FormsHelper.showToast(
        isAdded ? 'Saved to your favorites!' : 'Removed from your favorites.',
        isAdded ? 'success' : 'info'
      );
    }
    return isAdded;
  },

  has(productId) {
    return this.getWishlist().includes(productId);
  },

  moveToCart(productId) {
    if (window.ProductCatalog) {
      const product = window.ProductCatalog.getById(productId);
      if (product && window.CartController) {
        window.CartController.addItem(product, 1, product.sizes[0] || '500g');
        const list = this.getWishlist().filter(id => id !== productId);
        this.saveWishlist(list);
      }
    }
  },

  updateUI() {
    const list = this.getWishlist();

    // Update wishlist counter badges
    document.querySelectorAll('.wishlist-count-badge').forEach(badge => {
      badge.textContent = list.length;
      badge.style.display = list.length > 0 ? 'flex' : 'none';
    });

    // Update all wishlist heart buttons
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      const id = btn.getAttribute('data-wishlist-id');
      const icon = btn.querySelector('i');
      if (list.includes(id)) {
        btn.classList.add('active');
        if (icon) {
          icon.className = 'fas fa-heart text-danger';
        }
      } else {
        btn.classList.remove('active');
        if (icon) {
          icon.className = 'far fa-heart';
        }
      }
    });

    // Render Wishlist grid if container exists (e.g. in user-dashboard/wishlist.html)
    const wishlistContainer = document.getElementById('wishlist-items-container');
    if (wishlistContainer && window.ProductCatalog) {
      const products = window.ProductCatalog.getAll().filter(p => list.includes(p.id));
      if (products.length === 0) {
        wishlistContainer.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="far fa-heart fa-3x text-muted mb-3"></i>
            <h5>Your wishlist is currently empty</h5>
            <p class="text-muted">Save your favorite wildflower, forest, and organic honeys to review later.</p>
            <a href="../products.html" class="btn btn-honey btn-sm mt-2">Explore Honeys</a>
          </div>
        `;
      } else {
        wishlistContainer.innerHTML = products.map(item => `
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 border p-3 rounded-4 bg-surface">
              <img src="../${item.image}" alt="${item.name}" class="rounded-3 mb-3" style="height: 180px; object-fit: cover;">
              <span class="badge badge-honey align-self-start mb-2">${item.categoryName}</span>
              <h6 class="mb-1">${item.name}</h6>
              <div class="text-amber fw-bold mb-3">$${item.price.toFixed(2)}</div>
              <div class="d-flex gap-2 mt-auto">
                <button class="btn btn-honey btn-sm flex-grow-1" onclick="WishlistController.moveToCart('${item.id}')">
                  <i class="fas fa-shopping-basket me-1"></i> Move to Cart
                </button>
                <button class="btn btn-outline-danger btn-sm" onclick="WishlistController.toggle('${item.id}')">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  WishlistController.updateUI();

  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-wishlist-id]');
    if (btn) {
      e.preventDefault();
      const id = btn.getAttribute('data-wishlist-id');
      WishlistController.toggle(id);
    }
  });
});

window.WishlistController = WishlistController;
