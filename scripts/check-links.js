const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');
const dir = 'content/posts';

const slugs = new Set();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
files.forEach(f => {
  const { data } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (data.slug) slugs.add(data.slug);
});

const linkToFiles = {};
files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const matches = content.match(/\(\/features\/([^)]+)\)/g) || [];
  matches.forEach(m => {
    const slug = m.replace('(/features/', '').replace(')', '');
    if (!linkToFiles[slug]) linkToFiles[slug] = [];
    linkToFiles[slug].push(f);
  });
});

console.log('=== BROKEN LINKS ===');
let broken = 0;
const allLinked = Object.keys(linkToFiles).sort();
for (const link of allLinked) {
  if (!slugs.has(link)) {
    console.log('BROKEN: /features/' + link);
    console.log('  Used in: ' + linkToFiles[link].join(', '));
    // Try to find closest match
    for (const s of slugs) {
      if (s.includes(link.split('-')[0]) || link.includes(s.split('-')[0])) {
        if (Math.abs(s.length - link.length) < 15) {
          console.log('  Maybe: ' + s);
        }
      }
    }
    broken++;
  }
}
console.log('\nTotal: ' + broken + ' broken out of ' + allLinked.length + ' unique links');
