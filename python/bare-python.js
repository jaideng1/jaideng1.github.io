const content = document.getElementById("content"),
    canvasContainer = document.getElementById("transition-container");


const PYTHON_URL = "https://api.github.com/users/jaideng1/repos";
let repos = [];

async function loadProjects() {
    let response = await fetch(PYTHON_URL);
    let data = await response.json();

    //Added on cause for some reason it's not found in their api
    data.push({
        language: "Python",
        fork: false,
        updated_at: 1532242800001,
        name: "TicTacToe",
        description: "My first project with Python. It's a very inefficent python project, but it was my first time making Tic Tac Toe.",
        html_url: "https://github.com/jaideng1/TicTacToe"
    })

    data = data.sort((a, b) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

    repos = data;

    for (let repo of data) {
        if (repo.fork) continue;
        if (repo.language != "Python") continue;

        console.log(repo.name)
        
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
        p.innerHTML += "<br/><br/><i>Click to open repo.</i>"

        let copyOfURL = repo.html_url.split('').join('')

        div.onclick = () => {
            window.open(copyOfURL, "blank_")
        }

        div.classList.add("disabled-slide")
        div.classList.add("clickable-slide");
        div.classList.add("no-clicks")

        div = appendChildren(div, h3, time, p)
        content.appendChild(div)
    }
}

let onSlide = 0;

let lastWentRight = false;

function changeSlide(isRight) {
    if (lastWentRight == isRight) moveBubbles(isRight, true);

    setTimeout(() => {moveBubbles(!isRight)}, 150);

    lastWentRight = isRight;
}

function doSlideChange(isRight) {
    if (isRight) {
        onSlide++;
    } else onSlide--;

    if (onSlide < 0) onSlide = 0;
    if (onSlide >= content.children.length) onSlide = content.children.length - 1;

    let children = content.children;

    for (let child of children) {
        child.classList.remove("active-slide")
        child.classList.remove("disabled-slide")

        child.classList.add("disabled-slide")
        child.classList.add("no-clicks")
    }

    children[onSlide].classList.remove("disabled-slide")
    children[onSlide].classList.add("active-slide")
    children[onSlide].classList.remove("no-clicks")

    if (onSlide == 0) {
        document.getElementById("left-arrow").classList.remove("active-slide")
        document.getElementById("left-arrow").classList.add("disabled-slide")

        document.getElementById("right-arrow").classList.remove("disabled-slide")
        document.getElementById("right-arrow").classList.add("active-slide")
    } else if (onSlide == content.children.length - 1) {
        document.getElementById("right-arrow").classList.remove("active-slide")
        document.getElementById("right-arrow").classList.add("disabled-slide")

        document.getElementById("left-arrow").classList.remove("disabled-slide")
        document.getElementById("left-arrow").classList.add("active-slide")
    } else {
        document.getElementById("right-arrow").classList.remove("disabled-slide")
        document.getElementById("right-arrow").classList.add("active-slide")

        document.getElementById("left-arrow").classList.remove("disabled-slide")
        document.getElementById("left-arrow").classList.add("active-slide")
    }
}

window.addEventListener("load", () => {
    loadProjects();
    canvasContainer.classList.add("off-screen")
})

function appendChildren(parent, ...children) {
    for (let child of children) {
        parent.appendChild(child)
    }

    return parent;
}