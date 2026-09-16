const fs = require('fs');
const path = require('path');

const brain = 'C:\\Users\\Dhuvaragish\\.gemini\\antigravity\\brain\\51d81bdf-3e33-401d-ab8c-a19778a5f400';
const root = path.join(__dirname, '..');

const mapping = [
  { src: 'beehives_meadow_1789533010673.jpg', dst: 'assets/images/sourcing/beehive.jpg' },
  { src: 'honey_harvest_1789533064248.jpg', dst: 'assets/images/sourcing/honey-harvest.jpg' },
  { src: 'honey_gift_box_1789533138606.jpg', dst: 'assets/images/gifting/gift-box-1.jpg' },
  { src: 'honey_wedding_favors_1789533196844.jpg', dst: 'assets/images/gifting/gift-box-2.jpg' },
  { src: 'pure_date_syrup_1789533284832.jpg', dst: 'assets/images/products/date-syrup.jpg' },
  { src: 'pure_maple_syrup_1789533404255.jpg', dst: 'assets/images/products/maple-syrup.jpg' },
  { src: 'pure_agave_nectar_1789533587521.jpg', dst: 'assets/images/products/agave-nectar.jpg' },
  { src: 'acacia_honey_jar_1789501347306.jpg', dst: 'assets/images/products/acacia-honey.jpg' },
  { src: 'beekeeper_apiary_1789501375661.jpg', dst: 'assets/images/sourcing/beekeeper.jpg' },
  { src: 'wildflower_honey_jar_1789500968822.jpg', dst: 'assets/images/products/wildflower-honey.jpg' },
  { src: 'forest_honey_jar_1789501000791.jpg', dst: 'assets/images/products/forest-honey.jpg' },
  { src: 'organic_honey_jar_1789501032849.jpg', dst: 'assets/images/products/organic-honey.jpg' },
  { src: 'honeycomb_hero_1789500331826.jpg', dst: 'assets/images/hero/honey-hero.jpg' },
  { src: 'honeycomb_hero_1789500331826.jpg', dst: 'assets/images/products/raw-comb-honey.jpg' }
];

for (const m of mapping) {
  const srcFile = path.join(brain, m.src);
  if (fs.existsSync(srcFile)) {
    const target1 = path.join(root, m.dst);
    const target2 = path.join(root, 'natural-honey-store', m.dst);
    
    fs.mkdirSync(path.dirname(target1), { recursive: true });
    fs.mkdirSync(path.dirname(target2), { recursive: true });

    fs.copyFileSync(srcFile, target1);
    fs.copyFileSync(srcFile, target2);
    console.log(`[SUCCESS] Copied ${m.src} -> ${m.dst} (both directories)`);
  } else {
    console.error(`[ERROR] Missing source: ${srcFile}`);
  }
}

console.log('All image deployments finished.');
