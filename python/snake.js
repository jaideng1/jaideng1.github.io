
let snakes = [];

class Snake {
    constructor(startX, startY, color, size) {
        this.nodes = [];
        this.pos = {
            x: startX,
            y: startY
        }
        this.startX = startX;
        this.size = size;
        this.speed = this.size / 2;
        this.goingRight = true;
        this.stopAddingNodes = false;
        this.color = color;
    }
    get complete() {
        return (this.pos.y < 0 && this.nodes.length == 0)
    }
    move() {
        if (this.complete) return;

        if (!this.stopAddingNodes) this.nodes.push({
            x: this.pos.x,
            y: this.pos.y
        })

        if (this.stopAddingNodes) this.nodes.shift();

        this.pos.y -= this.speed / 2.5;
        if (this.goingRight) {
            this.pos.x += this.size / 25;
        } else {
            this.pos.x -= this.size / 25;
        }

        if (this.pos.y < 0) this.stopAddingNodes = true;

        if (Math.abs(this.pos.x - this.startX) >= 15) this.goingRight = !this.goingRight;
    }
    draw() {
        noStroke();

        fill(this.color.r, this.color.g, this.color.b)
        ellipse(this.pos.x, this.pos.y, this.size, this.size)

        for (let node of this.nodes) {
            ellipse(node.x, node.y, this.size, this.size)
        }

        fill(0)
        ellipse(this.pos.x - (this.size / 4) + 10, this.pos.y - (this.size / 4), 5, 5)
    }
    update() {
        this.move();
        this.draw();
    }

    static updateAllSnakes() {
        for (let snake of snakes) {
            snake.update();
        }
    }

    static createSnakes() {
        snakes = [];

        let size = 75;

        let n = Math.ceil(window.innerWidth / size) + 2;

        for (let i = 0; i < n; i++) {
            snakes.push(new Snake(i * size, window.innerHeight + size, (i % 2 == 0) ? {
                r: 53, 
                g: 184, 
                b: 240
            } : {
                r: 237, 
                g: 231, 
                b: 43
            }, size));
        }
    }
}