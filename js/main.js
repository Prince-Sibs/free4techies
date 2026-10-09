import { setupSearch } from './search.js'
import { setupActiveToc, copyLinkSetup } from './toc.js'
let ALL = {}

async function getResources() { return (await fetch('/public/resources.json')).json() }

function listToc(res) {
    const entries = Object.entries(res);
    document.getElementById('toc-count').textContent = `${entries.length} cats`
    
    const totalCount = entries.reduce((sum, [, category]) => {
        const items = Array.isArray(category) ? category : (category.items || []);
        return sum + items.length;
    }, 0);
    
    document.getElementById('total-count').textContent = `${totalCount} resources •`
    
    document.getElementById('table-of-content--main').innerHTML =
        entries.map(([slug, category]) => {
            const name = typeof category === 'string' ? category : (category.name || slug);
            const items = Array.isArray(category) ? category : (category.items || []);
            return `<li><a href="#${slug}">${name}<span class="toc-num">${items.length}</span></a></li>`;
        }).join('')
}

function load(res) {
    const c = document.getElementById('resources')
    let h = ''
    
    for (const [slug, category] of Object.entries(res)) {
        const name = typeof category === 'string' ? category : (category.name || slug);
        const tools = Array.isArray(category) ? category : (category.items || []);
        
        if (!tools.length) continue
        
        h += `<h3 id="${slug}">${name}<button class="copy-btn" data-id="${slug}"><svg
  xmlns="http://www.w3.org/2000/svg"
  width="12"
  height="12"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
  <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  <path d="M16 4h2a2 2 0 0 1 2 2v4" />
  <path d="M21 14H11" />
  <path d="m15 10-4 4 4 4" />
</svg></button></h3><ul>`
        
        tools.forEach(t => h += `<li><span><a href="${t.link}" target="_blank">${t.name}</a><span class="desc"> — ${t.desc}</span></span><span class="ext"><svg
  xmlns="http://www.w3.org/2000/svg"
  width="15"
  height="15"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M15 3h6v6" />
  <path d="M10 14 21 3" />
  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
</svg></span></li>`)
        
        h += '</ul>'
    }
    c.innerHTML = h || `<p style="color:#888">No results</p>`
}

function transformResources(res) {
    // Transform from new format to format compatible with search
    const transformed = {};
    
    for (const [slug, category] of Object.entries(res)) {
        const name = typeof category === 'string' ? category : (category.name || slug);
        const items = Array.isArray(category) ? category : (category.items || []);
        transformed[name] = items;
    }
    
    return transformed;
}

async function init() {
    ALL = await getResources(); 
    listToc(ALL); 
    load(ALL); 
    const transformedForSearch = transformResources(ALL);
    setupSearch(transformedForSearch, (filtered) => load(filtered)); 
    setupActiveToc(); 
    copyLinkSetup()
}
init()
