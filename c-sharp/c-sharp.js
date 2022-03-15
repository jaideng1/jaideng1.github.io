const letterC = document.getElementById("load-c"), 
letterS = document.getElementById("load-s"),
letterContainer = document.getElementById("load-cs"),
letterContainerParent = document.getElementById("load-letters");

const canvas = document.getElementById("canvas");

const ignoreOpen = false; /* just for testing */

window.addEventListener("load", () => {
    loadProjects();

    if (ignoreOpen) {
        letterContainerParent.style.transitionDuration = "0s";
        letterContainerParent.style.opacity = 0;
        return;
    }

    letterContainerParent.style.userSelect = "all";

    setTimeout(() => {
        letterC.style.opacity = 1;
        letterS.style.opacity = 1;
        letterC.style.left = "0px";
        letterS.style.top = "0px";

        setTimeout(() => {
            letterC.style.opacity = 0;
            letterS.style.opacity = 0;
            
            let boundingBox = letterContainer.getBoundingClientRect();

            let letterLeft = boundingBox.left;
            let letterTop = boundingBox.top;

            letterS.style.top = `${letterTop + 200}px`;
            letterC.style.left = `${letterLeft - 250}px`;

            setTimeout(() => {
                letterContainerParent.style.opacity = 0;
                for (let child of projects.children) {
                    child.classList.remove("hidden");
                }

                letterContainerParent.style.userSelect = "none";
            }, 1000)
        }, 1000);
    }, 500)
})


const CS_URL = "https://api.github.com/users/jaideng1/repos";
let repos = [];

let projectsInfo = [];

async function loadProjects() {
    let response = await fetch(CS_URL);
    let data = await response.json();

    data = data.sort((a, b) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

    repos = data;

    for (let repo of data) {
        if (repo.fork) continue;
        if (repo.language != "C#") continue;
                
        let date = new Date(repo.updated_at).toDateString().replace(" ", ", ").split("");
        //BTW this line won't work in 8000 years, hope no one looks at it then -_-
        date[date.length - 5] = ", ";

        projectsInfo.push({
            url: repo.html_url,
            name: repo.name,
            description: repo.description,
            updated_at: date.join('')
        });

        let div = document.createElement("div"),
            h3 = document.createElement("h3"),
            p = document.createElement("p"),
            time = document.createElement("p");

        h3.textContent = repo.name;

        p.textContent = repo.description;

        div.onclick = () => {
            window.open(repo.html_url, "blank_")
        }

        div = appendChildren(div, h3, time, p)
        div.classList.add("hidden")
        projects.appendChild(div)
    }
}

function appendChildren(parent, ...children) {
    for (let child of children) {
        parent.appendChild(child)
    }

    return parent;
}