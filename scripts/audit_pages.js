const fs = require('fs');
const path = require('path');

const pages = [
  'index.html',
  'home-2.html',
  'about.html',
  'products.html',
  'product-details.html',
  'health-benefits.html',
  'bulk-gifting.html',
  'services.html',
  'service-details.html',
  'pricing.html',
  'blog.html',
  'blog-details.html',
  'contact.html'
];

console.log('=== AUDITING MAIN STORE PAGES ===\n');

for (const p of pages) {
  if (!fs.existsSync(p)) continue;
  const html = fs.readFileSync(p, 'utf8');
  const imgRegex = /<img[^>]+>/g;
  let match;
  const imgs = [];
  while ((match = imgRegex.exec(html)) !== null) {
    const tag = match[0];
    const srcMatch = tag.match(/src=["']([^"']+)["']/);
    const altMatch = tag.match(/alt=["']([^"']*)["']/);
    const src = srcMatch ? srcMatch[1] : 'NONE';
    const alt = altMatch ? altMatch[1] : 'NONE';
    imgs.push({ src, alt, tag });
  }
  console.log(`Page: ${p} (${imgs.length} images)`);
  imgs.forEach(img => {
    console.log(`   src: ${img.src} | alt: "${img.alt}"`);
  });
  console.log('');
}
