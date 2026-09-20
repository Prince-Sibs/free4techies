export function setupActiveToc() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                document.querySelectorAll('#table-of-content a').forEach(a => a.classList.remove('active'))
                document.querySelector(`a[href="#${en.target.id}"]`)?.classList.add('active')
            }
        })
    }, { rootMargin: '-20% 0px -70% 0px' })
    setTimeout(() => document.querySelectorAll('#main-content h3').forEach(h => obs.observe(h)), 300)
}
export function copyLinkSetup() {
    document.addEventListener('click', e => {
        if (e.target.classList.contains('copy-btn')) {
            const id = e.target.dataset.id
            navigator.clipboard.writeText(`${location.origin}${location.pathname}#${id}`)
            e.target.textContent = 'copied!'
            setTimeout(() => e.target.textContent = '#', 1000)
        }
    })
}
