const fs = require('fs');

async function getUnsplash(tag) {
  try {
    const res = await fetch(`https://unsplash.com/s/photos/${encodeURIComponent(tag)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const imgRegex = /<img[^>]+alt="([^"]*)"[^>]+src="(https:\/\/images\.unsplash\.com\/photo-[^"?]+)\?[^"]*"/g;
    let match;
    const results = [];
    while ((match = imgRegex.exec(html)) !== null) {
      const alt = match[1];
      const url = match[2];
      if (alt && !alt.toLowerCase().includes('profile') && !alt.toLowerCase().includes('avatar')) {
        results.push({ alt, url });
        if (results.length >= 4) break;
      }
    }
    console.log(`\n=== Query: ${tag} ===`);
    results.forEach(r => console.log(`- [${r.alt}] -> ${r.url}`));
  } catch (err) {
    console.error(`Error fetching ${tag}:`, err.message);
  }
}

async function run() {
  await getUnsplash('beehive');
  await getUnsplash('beekeeping honey');
  await getUnsplash('honey harvest');
  await getUnsplash('honey gift set');
  await getUnsplash('date syrup');
  await getUnsplash('maple syrup bottle');
  await getUnsplash('agave nectar');
}

run();
