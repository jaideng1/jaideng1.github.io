const bubbleContainer = document.getElementById("bubbles");
const numOfBubbles = 50;

//Thanks to https://smooth.ie/blogs/news/svg-wavey-transitions-between-sections
const waveLeft = `
<div class="left-wave wave" style="left: 85%;"><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M92.55,-19.23 C36.68,78.46 133.18,95.23 73.93,180.10 L0.00,150.00 L-3.95,-6.41 Z" style="stroke: none;"></path></svg></div>`
const waveRight = `
<div class="right-wave wave" style="left: -40%;"><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M453.72,-5.41 C408.57,62.67 459.36,71.55 431.15,158.39 L500.00,150.00 L500.00,0.00 Z" style="stroke: none;"></path></svg></div>`


function generateBubbles() {
    let box = document.createElement("div");

    box.classList.add("bubble-box")

    box.style.left = "120%";

    bubbleContainer.appendChild(box);


    for (let i = 0; i < numOfBubbles; i++) {
        let bubble = document.createElement("div");

        bubble.classList.add("circle-bubble");

        bubble.style.top = `${i * (100 / numOfBubbles)}%`;
        bubble.style.left = `${Math.random() * 10 + 110}%`;

        bubbleContainer.appendChild(bubble);
    }

    for (let i = 0; i < numOfBubbles; i++) {
        let bubble = document.createElement("div");

        bubble.classList.add("circle-bubble");

        bubble.style.top = `${Math.random() * 90}%`;
        bubble.style.left = `${Math.random() * 10 + 210}%`;

        bubbleContainer.appendChild(bubble);
    }
}

function moveBubbles(isLeft, quickMove=false) {
    const circleBubbles = document.getElementsByClassName("circle-bubble");
    const adjustment = isLeft ? -240 : 240;

    for (let bubble of circleBubbles) {
        if (quickMove) bubble.style.transitionDuration = "0s";
        let currentPercent = parseInt((bubble.style.left).replace("%", ""));
        bubble.style.left = `${currentPercent + adjustment}%`;
    }

    const boxBubbles = document.getElementsByClassName("bubble-box");

    for (let bubble of boxBubbles) {
        if (quickMove) bubble.style.transitionDuration = "0s";
        let currentPercent = parseInt((bubble.style.left).replace("%", ""));
        bubble.style.left = `${currentPercent + adjustment}%`;
    }

    setTimeout(() => {
        circleBubbles.forEach(element => {
            element.style.transitionDuration = `${Math.random() * 0.3 + 1.85}s`;
        });

        boxBubbles.forEach(element => {
            element.style.transitionDuration = "2s";
        })
    }, 100)


    if (!quickMove) {
        setTimeout(() => {
            doSlideChange(!isLeft);
        }, 1000)
    }
}

window.addEventListener("load", () => {
    generateBubbles();

    setTimeout(() => {
        moveBubbles(true, true);
    }, 100)

    // setTimeout(() => {
    //     moveBubbles(false);
    // }, 2500)
})