import fs from 'fs';

const MAIN = process.argv[3] || 'public/resources.json';
const PR_FILE = process.argv[2] || 'contribution/resources.json';

const CATEGORY_SLUGS = {
  'ai-ml': 'AI & ML',
  'development-tools': 'Development Tools',
  'hosting-deployment': 'Hosting / Deployment',
  'databases-storage': 'Databases & Storage',
  'design-ui': 'Design & UI',
  'learning': 'Learning',
  'productivity-collaboration': 'Productivity & Collaboration',
  'others': 'Others'
};

function load(path) {
  if (!fs.existsSync(path)) {
    if (path === MAIN) return {};
    console.error(`Not found: ${path}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

function normalizeSlug(cat) {
  const lower = cat.toLowerCase().trim().replace(/_/g, '-').replace(/\s+/g, '-');
  if (CATEGORY_SLUGS[lower]) return lower;
  // try to find by display name
  const found = Object.entries(CATEGORY_SLUGS).find(([slug, name]) => 
    name.toLowerCase() === cat.toLowerCase()
  );
  return found ? found[0] : 'others';
}

function merge(main, contribution) {
  const result = { ...main };

  for (const [rawCat, items] of Object.entries(contribution)) {
    if (!Array.isArray(items)) {
      console.warn(`Skipping ${rawCat}: expected array, got ${typeof items}`);
      continue;
    }

    const slug = normalizeSlug(rawCat);
    
    // Ensure main structure exists for this slug
    if (!result[slug]) {
      result[slug] = {
        name: CATEGORY_SLUGS[slug] || slug,
        items: []
      };
    }
    // If main was in old array format, fix it
    if (Array.isArray(result[slug])) {
      result[slug] = { name: CATEGORY_SLUGS[slug] || slug, items: result[slug] };
    }
    if (!result[slug].items) result[slug].items = [];

    const existingLinks = new Set(result[slug].items.map(i => i.link));

    for (const item of items) {
      if (!item.name || !item.link) continue;
      if (item.link && !item.link.startsWith('http')) continue;

      if (!existingLinks.has(item.link)) {
        result[slug].items.push({
          name: item.name.trim(),
          desc: (item.desc || '').trim(),
          link: item.link.trim()
        });
        existingLinks.add(item.link);
      }
    }
  }

  return result;
}

const mainData = load(MAIN);
const prData = load(PR_FILE);

const merged = merge(mainData, prData);
fs.writeFileSync(MAIN, JSON.stringify(merged, null, 2) + '\n');
console.log(`✓ Merged ${Object.keys(prData).length} categories into ${MAIN}`);
