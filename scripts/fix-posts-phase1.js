const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(__dirname, '..', 'content', 'posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

// Helper: generate alt text from image filename
function generateAltText(imagePath, postTitle) {
  if (!imagePath) return postTitle || 'Blog image';
  const basename = path.basename(imagePath, path.extname(imagePath));
  return basename
    .replace(/[_-]+/g, ' ')
    .replace(/\b(hero|image|img|blog|uploads?|screenshot|jpeg|jpg|png|webp)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim() || postTitle || 'Blog image';
}

// Helper: extract plain text from excerpt (handles string or object)
function getExcerptText(excerpt) {
  if (!excerpt) return '';
  if (typeof excerpt === 'string') return excerpt.replace(/\n/g, ' ').trim();
  // TinaCMS rich-text excerpt stored as string in frontmatter
  return '';
}

// Helper: truncate to N chars at word boundary
function truncate(str, maxLen) {
  if (!str || str.length <= maxLen) return str;
  const truncated = str.substring(0, maxLen);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
}

// Map of all post slugs for internal linking
const allPosts = files.map(f => {
  const raw = fs.readFileSync(path.join(postsDir, f), 'utf8');
  const { data } = matter(raw);
  return { file: f, title: data.title || '', slug: data.slug || '' };
});

let stats = {
  descriptionsAdded: 0,
  lastUpdatedAdded: 0,
  altTextFixed: 0,
  slugsFixed: 0,
  boldHeadingsFixed: 0,
  totalFiles: files.length,
};

for (const file of files) {
  const filePath = path.join(postsDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  let body = content;
  let changed = false;

  // 1. Add description if missing
  if (!data.description) {
    const excerptText = getExcerptText(data.excerpt);
    if (excerptText) {
      data.description = truncate(excerptText.replace(/\s+/g, ' '), 160);
    } else {
      // Generate from title
      data.description = truncate(data.title || file.replace('.md', '').replace(/-/g, ' '), 160);
    }
    stats.descriptionsAdded++;
    changed = true;
  }

  // 2. Add lastUpdated if missing
  if (!data.lastUpdated) {
    data.lastUpdated = new Date('2026-03-09T00:00:00.000Z');
    stats.lastUpdatedAdded++;
    changed = true;
  }

  // 3. Fix slugs with spaces
  if (data.slug && data.slug.includes(' ')) {
    data.slug = data.slug.toLowerCase().replace(/\s+/g, '-');
    stats.slugsFixed++;
    changed = true;
  }

  // 4. Fix empty alt text on images: ![](/uploads/...) -> ![descriptive text](/uploads/...)
  const altRegex = /!\[\]\(([^)]+)\)/g;
  let match;
  let newBody = body;
  while ((match = altRegex.exec(body)) !== null) {
    const imgPath = match[1];
    const altText = generateAltText(imgPath, data.title);
    newBody = newBody.replace(match[0], `![${altText}](${imgPath})`);
    stats.altTextFixed++;
    changed = true;
  }
  // Also fix ![](</path>) format
  const altRegex2 = /!\[\]\(<([^>]+)>\)/g;
  while ((match = altRegex2.exec(body)) !== null) {
    const imgPath = match[1];
    const altText = generateAltText(imgPath, data.title);
    newBody = newBody.replace(match[0], `![${altText}](${imgPath.includes(' ') ? '<' + imgPath + '>' : imgPath})`);
    stats.altTextFixed++;
    changed = true;
  }
  body = newBody;

  // 5. Remove bold from headings: ## **Text** -> ## Text
  const boldHeadingRegex = /^(#{1,6})\s+\*\*(.+?)\*\*\s*$/gm;
  const beforeBoldFix = body;
  body = body.replace(boldHeadingRegex, '$1 $2');
  if (body !== beforeBoldFix) {
    stats.boldHeadingsFixed++;
    changed = true;
  }

  if (changed) {
    const output = matter.stringify(body, data);
    fs.writeFileSync(filePath, output);
  }
}

console.log('\n=== Phase 1 Fix Results ===');
console.log(`Total files processed: ${stats.totalFiles}`);
console.log(`Descriptions added: ${stats.descriptionsAdded}`);
console.log(`LastUpdated added: ${stats.lastUpdatedAdded}`);
console.log(`Alt text fixed: ${stats.altTextFixed}`);
console.log(`Slugs fixed: ${stats.slugsFixed}`);
console.log(`Bold headings fixed: ${stats.boldHeadingsFixed}`);
console.log('Done!\n');
