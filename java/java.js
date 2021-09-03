const selectedDir = document.getElementById("selected-dir"),
    sideContent = document.getElementsByClassName("side-content")[0],
    sideBar = document.getElementById('sidebar'),
    libaries = document.getElementById('libraries'),
    editorTitle = document.getElementById('editor-title'),
    editorDesc = document.getElementById('editor-desc'),
    openFiles = document.getElementById("open-files"),
    tools = document.getElementById("tools");

let selected = "";

const SVGs = {
    FILE: '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z" /></svg>'
}

/**
 * Move the selected bar to the specified element
 * @param {string} id The id of the element clicked.
 */
function onClickDir(id) {
    if (selected != "") {
        let ele = document.getElementById(selected)
        
        for (let c of ele.children) {
            if (c.tagName.toLowerCase() == "p") {
                c.style.color = "rgb(169, 169, 169)" 
                if (c.textContent.startsWith("~")) c.style.color = "rgb(94, 95, 96)"
            }
        }
    }

    selected = id;

    ele = document.getElementById(id)

    for (let c of ele.children) {
        if (c.tagName.toLowerCase() == "p") c.style.color = "white"
    }    

    adjSelectedDir()
    loadContent(id)
    openTab(id)
}

function adjSelectedDir() {
    if (selected == "") return;

    let ele = document.getElementById(selected)

    let box = ele.getBoundingClientRect()
    let sideBox = sideContent.getBoundingClientRect()
    let sideBarBox = sideBar.getBoundingClientRect()

    let hAdj = 16;

    selectedDir.style.top = (box.y + (hAdj / 2)) + 'px';
    selectedDir.style.left = sideBarBox.width + "px";
    selectedDir.style.width = (sideBox.width - sideBarBox.width) + 'px';
    selectedDir.style.height = (box.height - hAdj) + "px";
}

function adjustZIndexes() {
    let on = 100;
    for (let child of sideBar.children) {
        if (child.classList.contains('directory')) {
            child.style.zIndex = on;
            on--;
        }
    }
}

let content = [
    {
        txt: "Java is a language that I use for mainly making Minecraft Plugins. I'm doing ur mom",
        name: 'Java',
        id: 'home',
        repo: null
    }
]

function loadContent(id) {
    for (let c of content) {
        if (c.id == id) {
            editorTitle.textContent = c.name;
            editorDesc.textContent = c.txt;

            return;
        }
    }

    // editorTitle.textContent = "";
    // editorDesc.textContent = "";
}

let openTabs = []
let currentlyOpenTab = "";

function openTab(id) {
    if (openTabs.includes(id)) {
        for (let e of openFiles.children) {
            e.classList.remove("active-file")
        }
    
        document.getElementById(id + "-tab").classList.add("active-file")

        currentlyOpenTab = id;
        return;
    }

    openFiles.classList.remove("hidden")
    tools.classList.remove("hidden")

    let isOne = false;
    for (let c of content) {
        if (c.id == id) isOne = true;
    }

    if (!isOne) return;

    let div = document.createElement("div"),
        p = document.createElement("p"),
        close = document.createElement("div");

    p.textContent = limitText(id.replaceAll("-", "_") + ".txt", 10);

    close.innerHTML = "x";
    close.onclick = (event) => {
        closeTab(id)

        event.stopPropagation()
    }

    div.innerHTML = SVGs.FILE;
    div.classList.add("open-file")

    div.id = id + "-tab";

    for (let e of openFiles.children) {
        e.classList.remove("active-file")
    }

    div.classList.add("active-file")

    div.onclick = () => {
        openTab(id)
        
        for (let c of content) {
            if (c.id == id) {
                editorTitle.textContent = c.name;
                editorDesc.textContent = c.txt;
            }
        }
    }

    openTabs.push(id)
    
    appendChildren(div, p, close)
    appendChildren(openFiles, div)

    adjustTabMargins()

    currentlyOpenTab = id;
}

function adjustTabMargins() {
    for (let i = 0; i < openFiles.children.length; i++) {
        //if (i > 0) openFiles.children[i].style.marginLeft = (0.5) + "%";
    }
}

function closeTab(id) {
    document.getElementById(id + "-tab").remove()

    openTabs = openTabs.filter(e => e != id)

    if (openTabs.length == 0) {
        editorTitle.textContent = "";
        editorDesc.innerHTML = "<i>Double click on a file to open it.</i>";

        currentlyOpenTab = "";

        openFiles.classList.add("hidden")
        tools.classList.add("hidden")
    } else if (currentlyOpenTab == id) {
        for (let c of content) {
            if (c.id == openTabs[0]) {
                currentlyOpenTab = openTabs[0]
                
                editorTitle.textContent = c.name;
                editorDesc.textContent = c.txt;

                openTab(currentlyOpenTab)

                adjustTabMargins()
            }
        }
    }
    
}

const JAVA_URL = "https://api.github.com/users/jaideng1/repos";
let repos = [];

async function loadProjects() {
    let response = await fetch(JAVA_URL);
    let data = await response.json();

    if (data["message"] != null) {
        alert("There was an error while getting the api.")
        document.getElementsByTagName("body").innerHTML = data["message"];
        document.getElementsByTagName("body").innerHTML += `<br><a href="${data[""]}">See More</a>`
    }

    data = data.sort((a, b) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

    repos = data;

    for (let repo of data) {
        if (repo.fork) continue;
        if (repo.language != "Java") continue;
        
        let div = document.createElement("div"),
            p = document.createElement("p");

        p.textContent = repo.name.replaceAll(" ", "_").replaceAll("-", "_").toLowerCase() + ".txt"
        
        let id = repo.name.replaceAll(" ", "_")

        div.id = id;

        div.onclick = () => {
            onClickDir(id)
            loadContent(repo.name)
            //window.open(copyOfURL, "blank_")
        }

        div.classList.add("directory")

        div.innerHTML += SVGs.FILE

        div = appendChildren(div, p)

        div.style.marginLeft = "26.5%"

        content.push({
            name: repo.name,
            txt: repo.description,
            id,
            repo
        })
        
        libaries.parentNode.insertBefore(div, libaries);
    }

    return true;
}

function limitText(txt, len) {
    if (txt.length > len) {
        let editTxt = "";
        for (let i = 0; i < len - 3; i++) {
            editTxt += txt.split('')[i]
        }

        return editTxt + "..."
    }

    return txt;
}

function appendChildren(parent, ...children) {
    for (let child of children) {
        parent.appendChild(child)
    }

    return parent;
}

window.onresize = () => {
    adjSelectedDir()
}

window.onload = () => {
    loadProjects().then(a => {
        adjustZIndexes()
        onClickDir('home')
    })
}