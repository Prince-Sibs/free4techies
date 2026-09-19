async function getResources() {
    const res = await fetch('/public/resources.json');
    const data = await res.json();
    return data
}

function listToc(resources) {
    const toc = document.querySelector('#table-of-content--main');

    let list = Object.keys(resources);
    let doc = ''
    list.forEach(cat => {
        doc+=`<li><a href="#${cat}">${cat}</a></li>`
    })
    toc.innerHTML = doc;
}

function load(resources) {
    const container = document.querySelector("#resources");
    let html = '';

    for (const [category, data] of Object.entries(resources)) {
        html+=`<h3 id="${category}">${category}</h3><ul>`;

        data.forEach(tool => {
            html+=`<li><a href="${tool.link}" target="_blank">${tool.name}</a> - ${tool.desc}</li>`;
        });

        html+='</ul>';
    }

    container.innerHTML = html;
}

async function initial() {
    const resources = await getResources();
    listToc(resources);
    load(resources)
}

initial()