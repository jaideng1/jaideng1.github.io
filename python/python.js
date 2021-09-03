const content = document.getElementById("content"),
    canvasContainer = document.getElementById("transition-container"),
    transitionTime = 6000;

let canvas, queueClear = false, startTransition = false, inTransition = false, transIsRight = false, changedText = false;

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight)

    canvasContainer.appendChild(canvas.canvas)

    canvas.canvas.classList.add("off-screen")
    canvasContainer.classList.add("off-screen")
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
    erase(255,255)
    rect(0, 0, window.innerWidth, window.innerHeight)
    noErase();

    if (queueClear) {
        snakes = [];
        erase(255, 255);
        rect(0, 0, window.innerWidth, window.innerHeight)
        noErase();
        queueClear = false;
        //Doing all of this cause for some reason user-select: none; ISNT WORKING FOR NO REASON - LIKE WHY???? WHY ??????? WHY AREN"T YOU WORKING YOU PIECE OF S&%$
        document.getElementById("defaultCanvas0").classList.remove("on-screen")
        document.getElementById("defaultCanvas0").classList.add("off-screen")
        document.getElementById("transition-container").classList.remove("on-screen")
        document.getElementById("transition-container").classList.add("off-screen")

        changedText = false;
        return;
    }

    if (startTransition && !inTransition) {
        inTransition = true;
        startTransition = false;

        document.getElementById("defaultCanvas0").classList.remove("off-screen")
        document.getElementById("defaultCanvas0").classList.add("on-screen")
        document.getElementById("transition-container").classList.remove("off-screen")
        document.getElementById("transition-container").classList.add("on-screen")

        Snake.createSnakes();
    }

    if (inTransition) {
        let completed = 0;
        for (let snake of snakes) {
            if (snake.complete) completed++;
        }
        if (completed == snakes.length) {
            inTransition = false;
            queueClear = true;
        }
        Snake.updateAllSnakes();

        if (changedText) return;

        for (let snake of snakes) {
            if (snake.stopAddingNodes) {
                doSlideChange(transIsRight)

                changedText = true;

                break;
            }
        }
    }
}

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

        let copyOfURL = repo.html_url.split('').join('')

        div.onclick = () => {
            window.open(copyOfURL, "blank_")
        }

        div.classList.add("disabled-slide")
        div.classList.add("no-clicks")

        div = appendChildren(div, h3, time, p)
        content.appendChild(div)
    }
}

let onSlide = 0;

function changeSlide(isRight) {
    startTransition = true;

    transIsRight = isRight;
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
})

function appendChildren(parent, ...children) {
    for (let child of children) {
        parent.appendChild(child)
    }

    return parent;
}