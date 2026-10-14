const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'brain') continue;
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const files = getHtmlFiles('.');
console.log('Total HTML files:', files.length);

const imgReport = [];
const missingImages = new Set();

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const relFile = path.relative('.', f);
  const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const fullTag = match[0];
    const src = match[1];
    const altMatch = fullTag.match(/alt=["']([^"']*)["']/);
    const alt = altMatch ? altMatch[1] : 'MISSING_ALT';
    
    // Check if relative to file path or root
    const resolvedPath = path.resolve(path.dirname(f), src.split('?')[0]);
    const exists = fs.existsSync(resolvedPath);
    if (!exists && !src.startsWith('http') && !src.startsWith('data:')) {
      missingImages.add(relFile + ' -> ' + src);
    }
    imgReport.push({ file: relFile, src, alt, exists });
  }
}

console.log('Found total <img> occurrences:', imgReport.length);
if (missingImages.size > 0) {
  console.log('Missing images found:', Array.from(missingImages));
} else {
  console.log('ALL image paths exist on disk without exception!');
}

const uniqueSrcs = [...new Set(imgReport.map(r => r.src))];
console.log('\nUnique image sources used:');
uniqueSrcs.forEach(s => console.log('  -', s));
