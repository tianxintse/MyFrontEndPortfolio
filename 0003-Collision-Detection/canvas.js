/**
 * 辅助函数
 */
function randomIntFromRange(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function randomDoubleFromRange(low, high) {
    return Math.random() * (high - low + 1) + low;
}

function randomColors(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function getDistance(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

function resolveCollision(p1, p2) {
    let xVelocityDiff = p1.dx - p2.dx;
    let yVelocityDiff = p1.dy - p2.dy;

    let xDist = p1.x - p2.x;
    let yDist = p1.y - p2.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        let totalMass = p1.mass + p2.mass;

        // new velocity of p1
        let newP1Dx = ((p1.mass - p2.mass) * p1.dx + 2 * p2.mass * p2.dx) / totalMass;
        let newP1Dy = ((p1.mass - p2.mass) * p1.dy + 2 * p2.mass * p2.dy) / totalMass;
        // new velocity of p2
        let newP2Dx = ((p2.mass - p1.mass) * p2.dx + 2 * p1.mass * p1.dx) / totalMass;
        let newP2Dy = ((p2.mass - p1.mass) * p2.dy + 2 * p1.mass * p1.dy) / totalMass;

        p1.dx = newP1Dx;
        p1.dy = newP1Dy;
        p2.dx = newP2Dx;
        p2.dy = newP2Dy;
    }
}


/**
 * 颜色数组
 */
let colorArray = [
    '#F7473B',
    '#3B8B88',
    '#F2C14E',
    '#F78154',
    '#2176AE'
];

/**
 * 鼠标位置
 */
let mouse = {
    x: 10,
    y: 10
}


/**
 * 事件监听
 */
window.addEventListener('mousemove', function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});


/**
 * 绘图部分
 */
let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');

function Particle(x, y, dx, dy, radius, mass, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.mass = mass;
    this.color = color;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    this.update = function (particles) {
        // 碰撞检测
        for (let p of particles) {
            if (this === p) continue;
            if (getDistance(this.x, this.y, p.x, p.y) <= this.radius + p.radius) {
                resolveCollision(this, p);
            }
        }

        if (this.x + this.radius > canvas.width ||
            this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > canvas.height ||
            this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

let particles;

function init() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        let radius = randomIntFromRange(18, 20);
        let x = randomIntFromRange(radius, canvas.width - radius);
        let y = randomIntFromRange(radius, canvas.height - radius);

        // prevent overlap
        for (let j = 0; j < particles.length; j++) {
            if (getDistance(x, y, particles[j].x, particles[j].y) <=
                particles[j].radius + radius) {
                x = randomIntFromRange(radius, canvas.width - radius);
                y = randomIntFromRange(radius, canvas.height - radius);
                j = -1;
            }
        }
        let dx = randomDoubleFromRange(-2, 2);
        let dy = randomDoubleFromRange(-2, 2);
        let mass = radius * 0.5;
        let color = randomColors(colorArray);
        particles.push(new Particle(x, y, dx, dy, radius, mass, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of particles) {
        p.update(particles);
    }
}

init();
animate();