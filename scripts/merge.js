import fs from 'fs';

const MAIN = 'public/resource.json';
const PR = process.env.PR_FILE || 'contribution/resources.json';

function load(path) {
    return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

function normalize() {
    
}