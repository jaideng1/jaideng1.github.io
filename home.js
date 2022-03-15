/**
 * TODO: Add page tutorial on first time someone visits.
 */

const emptyPfp = document.getElementById("pfp-empty"), 
    wholePfp = document.getElementById("pfp-whole"),
    namePfp = document.getElementById("pfp-jaideng1"),
    menuContainer = document.getElementById("menu-container"),
    menuCircle = document.getElementById("menu-circle"),
    menuButtons = document.getElementsByClassName("menu-buttons")[0];

var scrl = window.scrollY;

let PAGE_WIDTH = window.innerWidth;
let PAGE_HEIGHT = window.innerHeight;

const maxMove = 100;
let maxMoveLeft = 0;
const maxMoveRightAdj = 512;
let maxMoveRight = PAGE_WIDTH - maxMoveRightAdj;

document.addEventListener("scroll", onScroll)

const scrollArrowTransitionTime = 0.25;

const downArrow = `<svg id="scroll-svg" style="width:64px;height:64px;margin-top:100px;transition-duration:${scrollArrowTransitionTime}s;" viewBox="0 0 24 24">
<path fill="currentColor" d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z" />
</svg>`;

const upArrow = `<svg id="scroll-svg" style="width:64px;height:64px;margin-top:100px;transition-duration:${scrollArrowTransitionTime}s;" viewBox="0 0 24 24">
<path fill="currentColor" d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" />
</svg>`;


let lastScroll = window.scrollY;
/**
 * When a scroll happens, adjust the screen based on how far the page is scrolled.
 * @returns
 */
function onScroll() {
    scrl = window.scrollY;

    if (scrl > 9300 && scrl < 9500) {
        document.getElementById("canvas-bg").style.opacity = (scrl - 9300) / 200;
    } else if (scrl <= 9300) {
        document.getElementById("canvas-bg").style.opacity = 0;
    } else if (scrl > 9500 && scrl < 12000) {
        document.getElementById("canvas-bg").style.opacity = 1;
    } else if (scrl > 12000 && scrl < 12500) {
        document.getElementById("canvas-bg").style.opacity = 1 - ((scrl - 12000) / 500);
    }

    if (scrl > 10000 && scrl < 12000) {
        document.getElementById("circle-where").style.opacity = 1;
    } else if (scrl > 9500 && scrl < 10000) {
        document.getElementById("circle-where").style.opacity = (scrl - 9500) / 500;
    } else if (scrl > 12000 && scrl < 12500) {
        document.getElementById("circle-where").style.opacity = 1 - ((scrl - 12000) / 500);
    } else {
        document.getElementById("circle-where").style.opacity = 0;
    }

    if (13000 - scrl > 50) {
        document.getElementById("socials-content").style.top = (13000 - scrl) + "px";
    } else {
        document.getElementById("socials-content").style.top = 50 + "px"
    }
    
    let imgStartX = { 
        right: wholePfp.getBoundingClientRect().right,
        left: wholePfp.getBoundingClientRect().left
    }

    if (lastScroll >= 4949 && scrl < 4949 || lastScroll <= 4951 && scrl > 4951 && !usingScrollButton) {
        initializeScroll();
    }
    
    if (scrl > 100 && scrl < 3100) {
        wholePfp.style.opacity = 1 - ((scrl - 100) / 3000);
        wholePfp.style.filter = `blur(${((scrl - 100) / 3000) * 5}px)`
        emptyPfp.style.opacity = ((scrl - 100) / 3000);
        namePfp.style.opacity = ((scrl - 100) / 3000);
    } else if (scrl <= 100) {
        wholePfp.style.opacity = 1;
        wholePfp.style.filter = "blur(0px)"
        emptyPfp.style.opacity = 0;
        namePfp.style.opacity = 0;
    } else if (scrl > 3000 && scrl < 8000) {
        let ld = Math.abs(distance2d(maxMoveLeft, imgStartX.left));
        let rd = Math.abs(distance2d(imgStartX.left, maxMoveRight));

        let percent = ((scrl - 3000) / 5000)
        let moveR = percent * rd;
        let moveL = percent * ld;

        emptyPfp.style.transform = "translate(" + moveR + "px, 0)"
        namePfp.style.transform = "translate(-" + moveL + "px, 0)"
    } else if (scrl > 8000 && scrl < 9000) {
        let ld = Math.abs(distance2d(maxMoveLeft, imgStartX.left));
        let rd = Math.abs(distance2d(imgStartX.left, maxMoveRight));

        let scale = 1 - ((scrl - 8000) / 2000);
        let moreMovement = ((scrl - 8000) / 1000);

        emptyPfp.style.transform = "translate(" + (rd + (moreMovement * 128)) + "px, 0) scale(" + scale + ")";
        namePfp.style.transform = "translate(-" + (ld + (moreMovement * 128)) + "px, 0) scale(" + scale + ")";
    }

    if (scrl < 3000) {
        emptyPfp.style.transform = "translate(0, 0)";
        namePfp.style.transform = "translate(0, 0)";
    }

    if (scrl > 9000) {
        let ld = Math.abs(distance2d(maxMoveLeft, imgStartX.left));
        let rd = Math.abs(distance2d(imgStartX.left, maxMoveRight));

        //Add 128 cause of the size adjust
        emptyPfp.style.transform = "translate(" + (rd + 128) + "px, 0) scale(0.5)"
        namePfp.style.transform = "translate(-" + (ld + 128) + "px, 0) scale(0.5)"
    }

    if (scrl > 9000) {
        emptyPfp.style.scale = 0.5;
        namePfp.style.scale = 0.5;
    }

    if (scrl > 3100) {
        wholePfp.style.opacity = 0;
        emptyPfp.style.opacity = 1;
        namePfp.style.opacity = 1;
    }

    lastScroll = window.scrollY;
}

var usingScrollButton = false;
function switchScroll() {
    if (usingScrollButton) return;
    let goingUp = scrl > 9990/2;
    window.scrollTo({top: goingUp ? 0 : 9900, behavior: 'smooth'});
    document.getElementById("scroll-svg").style.marginTop = "100px";
    usingScrollButton = true;
    setTimeout(() => {
        usingScrollButton = false;
    }, 600)

    setTimeout(() => {
        if (!goingUp) {
            document.getElementById("down-button").innerHTML = upArrow;
        } else document.getElementById("down-button").innerHTML = downArrow;

        setTimeout(() => {
            document.getElementById("scroll-svg").style.marginTop = "16px";
        },100)
    }, scrollArrowTransitionTime * 1000);
}

function initializeScroll() {
    let isDown = window.scrollY > 9900/2;
    if (isDown) {
        document.getElementById("down-button").innerHTML = upArrow;
    } else document.getElementById("down-button").innerHTML = downArrow;

    setTimeout(() => {
        document.getElementById("scroll-svg").style.marginTop = "16px";
    },100)
}


const NoAutoScroll = true;

/**
 * When the page loads, adjust the page based on the scroll.
 * @returns
 */
 window.addEventListener("load", () => {
    setTimeout(() => {
        if (!NoAutoScroll) scrollTo(0, 0); //Some things break if the page doesn't start up at the top, idk why, but this is just to fix it.
        //NVM disregard that last comment, i fixed it idk why i made the canvas absolute that was such a bad idea anyway i'll keep it here just in case.
    }, 50)

    setTimeout(() => {
        onScroll();
    }, 100)

    addMenuHoverEvents();

    initializeScroll();
})

/**
 * On resize, record the width and height and run the onScroll function.
 * @returns
 */
window.onresize = () => {
    PAGE_WIDTH = window.innerWidth;
    PAGE_HEIGHT = window.innerHeight;

    maxMoveRight = PAGE_WIDTH - maxMoveRightAdj;

    try {
        renderer.setSize( PAGE_WIDTH, PAGE_HEIGHT );

        //Change aspect ratio of camera
        camera.aspect = PAGE_WIDTH / PAGE_HEIGHT;
        camera.updateProjectionMatrix();
    } catch (e) {}

    onScroll();
}

/**
 * Go to the top of the page and go to my GitHub.
 * @returns
 */
function toTopAndGoToGit() {
    if (scrl < 8500) return;

    window.scrollTo({top: 0, behavior: 'smooth'});

    setTimeout(() => {
        location.href = "https://github.com/jaideng1"
    }, 750)
}

let menuTracker = {
    rectPos: {
        x: 0, h: 0, max: 0
    }
}

//old code
function pullOutMenu() {
    if (scrl > 9000) {
        menuContainer.classList.remove("ignore-clicks")
        menuContainer.style.opacity = 1;
        menuTracker.rectPos.x = window.innerWidth;
        menuTracker.rectPos.max = window.innerWidth;
        menuTracker.rectPos.h = window.innerHeight;

        let ctx = menuCanvas.getContext("2d")

        let timeToTake = 2000; //IN MS
        let frames = 128;

        for (let i = 0; i < frames; i++) {
            setTimeout(() => {
                menuTracker.rectPos.x -= menuTracker.rectPos.max / frames;

                ctx.fillStyle = "#FFFFFF"
                ctx.fillRect(menuTracker.rectPos.x, 0, 10000, menuTracker.rectPos.h)

                console.log(menuTracker.rectPos.x)
            }, timeToTake / frames * i);
        }
    }
}

var ableToUseMenu = true;

const listOfThingsThatAreMessedUpInZIndex = [
    "after-content",
    "break-it",
    "after-break"
]

/**
 * Allows the menu to be clicked on, and reveal it.
 * @returns
 */
function enableMenu() {
    if (scrl > 9000) {
        menuContainer.classList.remove("ignore-clicks")
        menuCircle.classList.remove("small-menu")
        menuCircle.classList.add("large-menu")

        document.getElementById("menu-content").classList.remove("hidden")
        document.getElementById("menu-content").classList.add("shown")

        for (let id of listOfThingsThatAreMessedUpInZIndex) {
            document.getElementById(id).classList.add("hidden")
        }
    }
}

/**
 * Disables the menu and hides it.
 * @returns
 */
function disableMenu() {
    menuContainer.classList.add("ignore-clicks")
    menuCircle.classList.remove("large-menu")
    menuCircle.classList.add("small-menu")

    document.getElementById("menu-content").classList.remove("shown")
    document.getElementById("menu-content").classList.add("hidden")

    for (let id of listOfThingsThatAreMessedUpInZIndex) {
        document.getElementById(id).classList.remove("hidden")
    }
}

function addMenuHoverEvents() {
    for (let child of menuButtons.children) {
        child.addEventListener("mouseover", onMenuHover);
        child.addEventListener("mouseout", onMenuMouseLeave);
    }
}

function onMenuHover(event) {
    let txt = event.target.textContent.toLowerCase();

    let childN = -1;

    if (txt === "javascript") {
        menuCircle.style.backgroundColor = "#038229";
        event.target.style.color = "#08c741";

        childN = 0;
    } else if (txt === "python") {
        menuCircle.style.backgroundColor = "#0e64a1";
        event.target.style.color = "#249bf0";

        childN = 1;
    } else if (txt === "java") {
        menuCircle.style.backgroundColor = "#a35e10";
        event.target.style.color = "#f5982f";

        childN = 2;
    } else if (txt === "c#") {
        menuCircle.style.backgroundColor = "#8c0d0b";
        event.target.style.color = "#e3615f";

        childN = 3;
    }

    for (let i = 0; i < menuButtons.children.length; i++) {
        if (i == childN) continue;

        menuButtons.children[i].style.color = "#878787";
    }
}

function onMenuMouseLeave(event) {
    menuCircle.style.backgroundColor = "#FFFFFF"

    for (let i = 0; i < menuButtons.children.length; i++) {
        menuButtons.children[i].style.color = "#000000";
    }
}

/**
 * Gets the distance between two numbers.
 * @param {Number} x1 The first number.
 * @param {Number} x2 The second number.
 * @returns {Number}
 */
function distance2d(x1, x2) {
    return distance(x1, 0, x2, 0)
}

/**
 * Gets the distance between two coordinates
 * @param {Number} x1 X of first coordinate
 * @param {Number} y1 Y of first coordinate
 * @param {Number} x2 X of second coordinate
 * @param {Number} y2 Y of second coordinate
 * @returns {Number}
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}