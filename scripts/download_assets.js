const fs = require('fs');
const path = require('path');

const dirs = [
  'assets/images/logo',
  'assets/images/hero',
  'assets/images/products',
  'assets/images/sourcing',
  'assets/images/gifting',
  'assets/images/testimonials',
  'assets/images/icons',
  'assets/fonts'
];

dirs.forEach(d => {
  const full = path.join(__dirname, '..', d);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
  }
});

const images = [
  {
    path: 'assets/images/hero/honey-hero.jpg',
    url: 'https://images.unsplash.com/photo-1576673442511-7e39b6545c87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    path: 'assets/images/products/wildflower-honey.jpg',
    url: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=600&q=80'
  },
  {
    path: 'assets/images/products/forest-honey.jpg',
    url: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=600&q=80'
  },
  {
    path: 'assets/images/products/organic-honey.jpg',
    url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=600&q=80'
  },
  {
    path: 'assets/images/products/raw-comb-honey.jpg',
    url: 'https://images.unsplash.com/photo-1576673442511-7e39b6545c87?auto=format&fit=crop&w=600&q=80'
  },
  {
    path: 'assets/images/products/acacia-honey.jpg',
    url: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80'
  },
  {
    path: 'assets/images/products/date-syrup.jpg',
    url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80'
  },
  {
    path: 'assets/images/products/agave-nectar.jpg',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
  },
  {
    path: 'assets/images/products/maple-syrup.jpg',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80'
  },
  {
    path: 'assets/images/sourcing/beekeeper.jpg',
    url: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80'
  },
  {
    path: 'assets/images/sourcing/beehive.jpg',
    url: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=800&q=80'
  },
  {
    path: 'assets/images/sourcing/honey-harvest.jpg',
    url: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80'
  },
  {
    path: 'assets/images/gifting/gift-box-1.jpg',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
  },
  {
    path: 'assets/images/gifting/gift-box-2.jpg',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
  },
  {
    path: 'assets/images/testimonials/customer-1.jpg',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  },
  {
    path: 'assets/images/testimonials/customer-2.jpg',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  }
];

async function downloadFile(item) {
  const dest = path.join(__dirname, '..', item.path);
  try {
    const res = await fetch(item.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    console.log(`[OK] Downloaded ${item.path} (${(buffer.length/1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`[ERR] Failed ${item.path}: ${err.message}`);
  }
}

async function run() {
  for (const item of images) {
    await downloadFile(item);
  }
  console.log('All image downloads completed.');
}

run();
