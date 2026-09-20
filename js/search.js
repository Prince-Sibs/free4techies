export function setupSearch(allData, loadFn) {
    const input = document.getElementById('search')
    if (!input) return
    input.addEventListener('input', e => {
        const q = e.target.value.toLowerCase().trim()
        if (!q) return loadFn(allData)
        const filtered = {}
        for (const [cat, tools] of Object.entries(allData)) {
            const byCat = cat.toLowerCase().includes(q)
            const byTools = tools.filter(t => `${t.name} ${t.desc}`.toLowerCase().includes(q))
            if (byCat) filtered[cat] = tools
            else if (byTools.length) filtered[cat] = byTools
        }
        loadFn(filtered)
    })
    window.addEventListener('keydown', e => {
        if (e.key === 'Control' && document.activeElement !== input) { e.preventDefault(); input.focus() }
    })
}
