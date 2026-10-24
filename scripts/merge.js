import fs from 'fs';

const MAIN = 'public/resources.json';
const PR = process.argv[2] || process.env.PR_FILE || 'contribution/resources.json';

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
    try {
        if (!fs.existsSync(path)) {
            if (path === MAIN) return {}; // allow empty main on first run
            throw new Error(`File not found`);
        }
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    } catch (e) {
        console.error(`Error loading ${path}:`, e.message);
        process.exit(1);
    }
}

function normalizeCategory(slug) {
  if (CATEGORY_SLUGS[slug]) return slug;
  const found = Object.entries(CATEGORY_SLUGS).find(([k, v]) => v === slug);
  if (found) return found[0];
  console.warn(`Unknown category "${slug}", placing in "others"`);
  return 'others';
}

function normalizeStructure(data) {
  const normalized = {};
  for (const [key, value] of Object.entries(data)) {
    const slug = normalizeCategory(key);
    const items = Array.isArray(value) ? value : (value.items || []);
    if (!normalized[slug]) {
      normalized[slug] = { name: CATEGORY_SLUGS[slug], items: [] };
    }
    normalized[slug].items.push(...items);
  }
  return normalized;
}

function merge(main, pr) {
    const result = { ...main };
    for (const [slug, category] of Object.entries(pr)) {
        const normalizedSlug = normalizeCategory(slug);
        const items = Array.isArray(category) ? category : (category.items || []);
        if (!result[normalizedSlug]) {
            result[normalizedSlug] = { name: CATEGORY_SLUGS[normalizedSlug], items: [] };
        }
        const existingLinks = new Set(result[normalizedSlug].items.map(item => item.link));
        for (const item of items) {
            if (!item.link) continue;
            if (!existingLinks.has(item.link)) {
                result[normalizedSlug].items.push(item);
                existingLinks.add(item.link);
            }
        }
    }
    return result;
}

function save(path, data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
    console.log(`✓ Merged resources saved to ${path}`);
}

function validate(data) {
  const errors = [];
  for (const [slug, category] of Object.entries(data)) {
    if (!CATEGORY_SLUGS[slug]) errors.push(`Invalid category slug: "${slug}"`);
    const items = Array.isArray(category) ? category : (category.items || []);
    items.forEach((item, idx) => {
      if (!item.name || !item.desc || !item.link) {
        errors.push(`Item ${idx} in "${slug}" missing required fields (name, desc, link)`);
      } else if (!item.link.startsWith('http')) {
        errors.push(`Item "${item.name}" has invalid link: ${item.link}`);
      }
    });
  }
  return errors;
}

// Main
if (!fs.existsSync(PR)) {
    console.error(`Contribution file not found: ${PR}`);
    process.exit(1);
}

const mainData = normalizeStructure(load(MAIN));
const prData = normalizeStructure(load(PR));

const errors = validate(prData);
if (errors.length > 0) {
  console.error('Validation errors:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
}

const merged = merge(mainData, prData);
save(MAIN, merged);
console.log('✓ Validation passed');
