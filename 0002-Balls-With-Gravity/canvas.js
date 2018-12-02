/**
 * 辅助函数
 */
function randomIntFromRange(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function randomColors(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');

let colorArray = [
    '#F7473B',
    '#3B8B88',
    '#F2C14E',
    '#F78154',
    '#2176AE'
];

let Gravity = 0.8;
let Friction = 0.9;

function Ball(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    this.update = function () {
        if (this.y + this.radius + this.dy + Gravity > canvas.height) {
            this.dy = -this.dy
            this.dy *= Friction;
            this.dx *= Friction;
        } else {
            this.dy += Gravity;
        }

        if (this.x + this.radius + this.dx >= canvas.width ||
            this.x - this.radius + this.dx <= 0) {
            this.dx = -this.dx;
        }

        this.y += this.dy;
        this.x += this.dx;
        this.draw();
    }
}


let ballArray = [];

function init() {
    ballArray = [];
    for (let i = 0; i < 400; i++) {
        let radius = randomIntFromRange(8, 20);
        let x = randomIntFromRange(radius, canvas.width - radius);
        let dx = randomIntFromRange(-5, 5);
        let y = randomIntFromRange(radius, canvas.height - radius);
        let dy = randomIntFromRange(-2, 2);
        let color = randomColors(colorArray);
        let ball = new Ball(x, y, dx, dy, radius, color);
        ballArray.push(ball);
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let ball of ballArray) {
        ball.update();
    }
}

window.addEventListener('click', init);
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});

init();
animate();