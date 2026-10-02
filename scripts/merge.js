import fs from 'fs';

const MAIN = 'public/resources.json';
const PR = process.argv[2] || process.env.PR_FILE || 'contribution/resources.json';

function load(path) {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    } catch (e) {
        console.error(`Error loading ${path}:`, e.message);
        process.exit(1);
    }
}

function merge(main, pr) {
    const result = { ...main };
    
    for (const [category, items] of Object.entries(pr)) {
        if (!result[category]) {
            result[category] = [];
        }
        // Merge and deduplicate by link
        const existingLinks = new Set(result[category].map(item => item.link));
        for (const item of items) {
            if (!existingLinks.has(item.link)) {
                result[category].push(item);
                existingLinks.add(item.link);
            }
        }
    }
    
    return result;
}

function save(path, data) {
    try {
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        console.log(`✓ Merged resources saved to ${path}`);
    } catch (e) {
        console.error(`Error saving ${path}:`, e.message);
        process.exit(1);
    }
}

// Main
if (!fs.existsSync(PR)) {
    console.error(`Contribution file not found: ${PR}`);
    process.exit(1);
}

const mainData = load(MAIN);
const prData = load(PR);
const merged = merge(mainData, prData);
save(MAIN, merged);
