/**
 * AMBER & OAK - PRODUCTS CONTROLLER (products.js)
 * Dynamic catalog rendering, real-time filtering, search, and quick view
 */

const ProductCatalog = {
  // Reliable embedded dataset ensuring offline & file:// compatibility
  items: [
    {
      id: "prod-1",
      name: "Wild Alpine Meadow Honey",
      category: "wildflower",
      categoryName: "Wildflower Honey",
      tagline: "Unheated nectar from sub-alpine flora and clover",
      price: 24.50,
      comparePrice: 29.00,
      rating: 4.9,
      reviewCount: 128,
      inStock: true,
      stockQuantity: 85,
      badge: "Bestseller",
      image: "assets/images/products/wildflower-honey.jpg",
      origin: "Julian Alps, Slovenia (Elevation 1,200m)",
      harvestSeason: "Late Spring / Early Summer",
      colorGrade: "Light Amber",
      tastingNotes: ["Floral", "Chamomile", "Mild Citrus"],
      description: "Harvested from pristine alpine meadows blooming with wild thyme and white clover. 100% unpasteurized, cold-spun, and unfiltered.",
      sizes: ["250g", "500g", "1kg"]
    },
    {
      id: "prod-2",
      name: "Black Forest Honeydew Honey",
      category: "forest",
      categoryName: "Forest Honey",
      tagline: "Dark, mineral-rich nectar from ancient conifers and oak",
      price: 28.00,
      comparePrice: 34.00,
      rating: 4.8,
      reviewCount: 94,
      inStock: true,
      stockQuantity: 42,
      badge: "Rare Harvest",
      image: "assets/images/products/forest-honey.jpg",
      origin: "Black Forest Biosphere, Germany",
      harvestSeason: "Mid Summer",
      colorGrade: "Deep Amber to Mahogany",
      tastingNotes: ["Malty", "Woody", "Dried Fig"],
      description: "Waldhonig collected from ancient conifer trees. Boasting twice the antioxidant power of ordinary honey.",
      sizes: ["250g", "500g", "1kg"]
    },
    {
      id: "prod-3",
      name: "Himalayan Organic Raw Honey",
      category: "organic",
      categoryName: "Certified Organic",
      tagline: "Wild collected from pesticide-free Himalayan valleys",
      price: 32.00,
      comparePrice: 38.00,
      rating: 5.0,
      reviewCount: 164,
      inStock: true,
      stockQuantity: 60,
      badge: "Organic Certified",
      image: "assets/images/products/organic-honey.jpg",
      origin: "Kullu Valley, Western Himalayas",
      harvestSeason: "Autumn Bloom",
      colorGrade: "Golden Amber",
      tastingNotes: ["Warm spices", "Rhododendron", "Walnut"],
      description: "USDA & EU Organic certified. Gathered by generational beekeepers in untouched mountain valleys.",
      sizes: ["250g", "500g", "1kg"]
    },
    {
      id: "prod-4",
      name: "Artisan Raw Honeycomb Slab",
      category: "comb",
      categoryName: "Raw Honeycomb",
      tagline: "100% untouched virgin beeswax comb straight from hive",
      price: 36.50,
      comparePrice: 42.00,
      rating: 4.9,
      reviewCount: 78,
      inStock: true,
      stockQuantity: 28,
      badge: "Pure Hive Cut",
      image: "assets/images/products/raw-comb-honey.jpg",
      origin: "Provence Sanctuary, France",
      harvestSeason: "Summer Solstice",
      colorGrade: "Sunlit Gold",
      tastingNotes: ["Lavender", "Fresh wax", "Silky caramel"],
      description: "Untouched comb sealed by bees with virgin wax. Unfiltered natural delicacy for cheeses and toast.",
      sizes: ["350g Slab", "700g Box"]
    },
    {
      id: "prod-5",
      name: "Organic Acacia Blossom Honey",
      category: "organic",
      categoryName: "Certified Organic",
      tagline: "Crystal-clear, slow-crystallizing delicate sweetener",
      price: 26.00,
      comparePrice: 30.00,
      rating: 4.7,
      reviewCount: 83,
      inStock: true,
      stockQuantity: 50,
      badge: "Delicate & Mild",
      image: "assets/images/products/acacia-honey.jpg",
      origin: "Danube Basin, Hungary",
      harvestSeason: "Spring",
      colorGrade: "Water White",
      tastingNotes: ["Vanilla", "Acacia petals", "Clean sweet"],
      description: "Naturally high in fructose and low on glycemic index. Remains beautifully liquid.",
      sizes: ["250g", "500g", "1kg"]
    },
    {
      id: "prod-6",
      name: "Pure Artisan Date Nectar",
      category: "sweeteners",
      categoryName: "Natural Sweetener",
      tagline: "Single-ingredient cold-extracted Medjool syrup",
      price: 19.50,
      comparePrice: 24.00,
      rating: 4.8,
      reviewCount: 61,
      inStock: true,
      stockQuantity: 72,
      badge: "Vegan Friendly",
      image: "assets/images/products/date-syrup.jpg",
      origin: "Jordan River Valley",
      harvestSeason: "Late Autumn",
      colorGrade: "Molasses Dark Brown",
      tastingNotes: ["Caramelized Date", "Toffee", "Dark berry"],
      description: "Unrefined single-ingredient syrup crafted strictly from tree-ripened organic Medjool dates.",
      sizes: ["350ml", "750ml"]
    },
    {
      id: "prod-7",
      name: "Raw Blue Agave Nectar",
      category: "sweeteners",
      categoryName: "Natural Sweetener",
      tagline: "Low-glycemic plant nectar from mature Weber Agave",
      price: 18.00,
      comparePrice: 22.00,
      rating: 4.6,
      reviewCount: 52,
      inStock: true,
      stockQuantity: 65,
      badge: "Low GI",
      image: "assets/images/products/agave-nectar.jpg",
      origin: "Jalisco Highlands, Mexico",
      harvestSeason: "Year-Round",
      colorGrade: "Honey Amber",
      tastingNotes: ["Clean sweetness", "Agave core"],
      description: "Low-heat extracted agave syrup that dissolves effortlessly in cold brew drinks and dressing.",
      sizes: ["350ml", "750ml"]
    },
    {
      id: "prod-8",
      name: "Organic Canadian Maple Syrup",
      category: "sweeteners",
      categoryName: "Natural Sweetener",
      tagline: "Wood-fired Grade A Dark robust syrup",
      price: 27.50,
      comparePrice: 32.00,
      rating: 4.9,
      reviewCount: 115,
      inStock: true,
      stockQuantity: 48,
      badge: "Heritage Reserve",
      image: "assets/images/products/maple-syrup.jpg",
      origin: "Quebec, Canada",
      harvestSeason: "Spring Thaw",
      colorGrade: "Dark Amber",
      tastingNotes: ["Toasted pecan", "Woodsmoke", "Vanilla"],
      description: "Wood-fired artisanal maple syrup containing 54 active antioxidants and pure tree goodness.",
      sizes: ["250ml", "500ml", "1 Liter"]
    },
    {
      id: "prod-9",
      name: "Bourbon Barrel-Aged Maple Syrup",
      category: "sweeteners",
      categoryName: "Natural Sweetener",
      tagline: "Aged in charred American oak casks for rich smoky caramel notes",
      price: 34.00,
      comparePrice: 39.50,
      rating: 5.0,
      reviewCount: 92,
      inStock: true,
      stockQuantity: 36,
      badge: "Small Batch",
      image: "assets/images/products/barrel-maple-syrup.jpg",
      origin: "Vermont, USA",
      harvestSeason: "Spring Harvest / Aged 6 Mo",
      colorGrade: "Mahogany Amber",
      tastingNotes: ["Bourbon oak", "Toasted caramel", "Vanilla"],
      description: "Pure Grade A maple syrup rested for six months inside charred bourbon casks. Non-alcoholic, with deep butterscotch and vanilla warmth.",
      sizes: ["355ml Flask", "750ml Bottle"]
    }
  ],

  async init() {
    try {
      const res = await fetch('data/products.json');
      if (res.ok) {
        const loaded = await res.json();
        if (Array.isArray(loaded) && loaded.length > 0) {
          this.items = loaded;
        }
      }
    } catch (e) {
      // Graceful fallback to embedded data if running directly via file:// protocol
      console.log('Using embedded catalog dataset for optimal portability.');
    }
  },

  getAll() {
    return this.items;
  },

  getById(id) {
    return this.items.find(item => item.id === id);
  },

  renderCard(p, basePath = '') {
    const isWished = window.WishlistController ? window.WishlistController.has(p.id) : false;
    const notesHtml = (p.tastingNotes || []).map(n => `<span class="tasting-tag">${n}</span>`).join('');
    const badgeHtml = p.badge ? `<span class="badge badge-honey product-badge-flag">${p.badge}</span>` : '';

    return `
      <div class="col-md-6 col-lg-4 mb-4 product-grid-item" data-category="${p.category}" data-price="${p.price}" data-rating="${p.rating}">
        <div class="product-card">
          <div class="product-card-thumb">
            ${badgeHtml}
            <button class="product-wishlist-toggle ${isWished ? 'active' : ''}" data-wishlist-id="${p.id}" title="Add to Wishlist" aria-label="Add to Wishlist">
              <i class="${isWished ? 'fas fa-heart text-danger' : 'far fa-heart'}"></i>
            </button>
            <a href="${basePath}product-details.html?id=${p.id}">
              <img src="${basePath}${p.image}" alt="${p.name}" loading="lazy">
            </a>
          </div>
          <div class="product-card-body">
            <div class="product-origin">
              <i class="fas fa-map-marker-alt text-amber"></i> ${p.origin}
            </div>
            <h5 class="product-name">
              <a href="${basePath}product-details.html?id=${p.id}">${p.name}</a>
            </h5>
            <div class="product-rating">
              <i class="fas fa-star"></i>
              <span class="fw-bold">${p.rating}</span>
              <span>(${p.reviewCount || 45})</span>
            </div>
            <div class="product-tasting-tags">
              ${notesHtml}
            </div>
            <div class="product-card-footer">
              <div class="product-price">
                $${p.price.toFixed(2)}
                ${p.comparePrice ? `<span class="compare-price">$${p.comparePrice.toFixed(2)}</span>` : ''}
              </div>
              <button class="btn btn-honey btn-sm" onclick="CartController.addItem({id:'${p.id}', name:'${p.name.replace(/'/g, "\\'")}', price:${p.price}, image:'${basePath}${p.image}'}, 1, '${p.sizes ? p.sizes[0] : '500g'}')">
                <i class="fas fa-shopping-basket me-1"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderGrid(containerId, filterCat = 'all', maxItems = 0, basePath = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let list = this.items;
    if (filterCat !== 'all') {
      list = list.filter(item => item.category === filterCat);
    }
    if (maxItems > 0) {
      list = list.slice(0, maxItems);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-search fa-3x text-muted mb-3"></i>
          <h5>No Honeys Found</h5>
          <p class="text-muted">Try clearing your filters or search keywords.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => this.renderCard(item, basePath)).join('');
    if (window.WishlistController) window.WishlistController.updateUI();
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  await ProductCatalog.init();

  // Render home featured products if element exists
  ProductCatalog.renderGrid('featured-products-grid', 'all', 6);

  // Render full products page if element exists
  ProductCatalog.renderGrid('all-products-grid', 'all');

  // Filter category buttons
  document.querySelectorAll('[data-product-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('[data-product-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-product-filter');
      ProductCatalog.renderGrid('all-products-grid', cat);
    });
  });

  // Search input filter
  const searchInput = document.getElementById('product-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const items = document.querySelectorAll('.product-grid-item');
      items.forEach(el => {
        const text = el.textContent.toLowerCase();
        el.style.display = text.includes(query) ? 'block' : 'none';
      });
    });
  }

  // Price slider filter
  const priceSlider = document.getElementById('price-range-slider');
  const priceDisplay = document.getElementById('price-range-value');
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', (e) => {
      const maxPrice = Number(e.target.value);
      priceDisplay.textContent = `$${maxPrice}`;
      const items = document.querySelectorAll('.product-grid-item');
      items.forEach(el => {
        const price = Number(el.getAttribute('data-price') || 0);
        el.style.display = price <= maxPrice ? 'block' : 'none';
      });
    });
  }

  // Sorting
  const sortSelect = document.getElementById('product-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      const container = document.getElementById('all-products-grid');
      if (!container) return;
      let sorted = [...ProductCatalog.items];
      if (val === 'price-low') sorted.sort((a, b) => a.price - b.price);
      else if (val === 'price-high') sorted.sort((a, b) => b.price - a.price);
      else if (val === 'rating') sorted.sort((a, b) => b.rating - a.rating);
      container.innerHTML = sorted.map(item => ProductCatalog.renderCard(item)).join('');
      if (window.WishlistController) window.WishlistController.updateUI();
    });
  }
});

window.ProductCatalog = ProductCatalog;
