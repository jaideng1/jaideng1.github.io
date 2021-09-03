/* Yeah I know, crazy naming skills <o/ */

const hoverContainer = document.getElementById("hover-container"),
    hoverImg = document.getElementById("hover-img"),
    projects = document.getElementById("projects");

const hoverInfo = {
    nodejs: {
        img: "https://images.g2crowd.com/uploads/product/image/large_detail/large_detail_f0b606abb6d19089febc9faeeba5bc05/nodejs-development-services.png",
        to: "https://nodejs.org"
    },
    react: {
        img: "https://nextsoftware.io/files/images/logos/main/reactjs-logo.png",
        to: "https://reactjs.org/"
    }
}

function addHoverListeners() {
    let hovers = document.getElementsByClassName("hover");

    for (let hover of hovers) {
        hover.addEventListener("mouseover", (event) => {
            onHover(event.target)
        })

        hover.addEventListener("mouseout", () => {
            onMouseOffHover()
        })

        hover.addEventListener("click", (event) => {
            onHoverClick(event.target)
        })
    }
}

/**
 * Creates an info box above hover element.
 * @param {Object} hEle 
 * @returns 
 */
function onHover(hEle) {
    let txt = hEle.textContent;
    if (!hoverInfo[txt.toLowerCase()]) return;

    let img = hoverInfo[txt.toLowerCase()].img;
    hoverImg.src = img;
    
    let bounds = hEle.getBoundingClientRect();

    hoverImg.style = `left: ${bounds.x + 20}px; top: ${bounds.y - 80}px;`

    hoverImg.classList.remove("hidden")
    hoverImg.classList.add("shown")
}

/**
 * Hide the hover image once done.
 */
function onMouseOffHover() {
    hoverImg.classList.remove("shown")
    hoverImg.classList.add("hidden")
}

/**
 * When a hover element is clicked, bring it to the webpage.
 * @param {Object} hEle 
 * @returns 
 */
function onHoverClick(hEle) {
    let txt = hEle.textContent;
    if (!hoverInfo[txt.toLowerCase()]) return;

    let link = hoverInfo[txt.toLowerCase()].to;

    window.open(link, "_blank")
}

const JS_URL = "https://api.github.com/users/jaideng1/repos";
let repos = [];

async function loadProjects() {
    let response = await fetch(JS_URL);
    let data = await response.json();

    projects.innerHTML = "";

    data = data.sort((a, b) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

    repos = data;

    for (let repo of data) {
        if (repo.fork) continue;
        if (repo.language != "JavaScript" && repo.language != "HTML") continue;
        
        let div = document.createElement("div"),
            h3 = document.createElement("h3"),
            p = document.createElement("p"),
            time = document.createElement("p");

        h3.textContent = repo.name;
        
        let date = new Date(repo.updated_at).toDateString().replace(" ", ", ").split("");
        //BTW this line won't work in 8000 years, hope no one looks at it then -_-
        date[date.length - 5] = ", ";
        time.textContent = "Last Updated: " + date.join('')

        p.textContent = repo.description;

        div.onclick = () => {
            window.open(repo.html_url, "blank_")
        }

        div = appendChildren(div, h3, time, p)
        projects.appendChild(div)
    }
}

window.addEventListener("load", () => {
    addHoverListeners();
    loadProjects();
})

function appendChildren(parent, ...children) {
    for (let child of children) {
        parent.appendChild(child)
    }

    return parent;
}