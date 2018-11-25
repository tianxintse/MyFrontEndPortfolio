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


/**
 * 颜色数组
 */
let colorArray = [
    '#97A7F8',
    '#C957CA',
    '#76E2FE',
];


/**
 * 鼠标位置
 */
let mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
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
canvas.style.backgroundColor = 'rgba(0, 0, 0, 1)';

let ctx = canvas.getContext('2d');
let globalAlpha = 0.3;


function Particle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.radians = randomDoubleFromRange(0, Math.PI * 2);
    this.distanceFromCenter = randomIntFromRange(50, 100);
    this.velocity = 0.05;
    this.dragSpeed = 0.05;
    this.lastMouse = {
        x: x,
        y: y
    };

    this.draw = function (lastPosition) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.radius;
        ctx.moveTo(lastPosition.x, lastPosition.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.closePath();
    }

    this.update = function () {
        let lastPosition = {
            x: this.x,
            y: this.y
        };

        // 拖拽效果
        this.lastMouse.x += (mouse.x - this.lastMouse.x) * this.dragSpeed;
        this.lastMouse.y += (mouse.y - this.lastMouse.y) * this.dragSpeed;

        this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
        this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;

        this.radians += this.velocity;

        this.draw(lastPosition);
    }
}

let particles;

function init() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        let radius = randomDoubleFromRange(2, 3)
        let color = randomColors(colorArray);
        particles.push(new Particle(window.innerWidth / 2, window.innerHeight / 2, radius, color));
    }
}

function animate() {
    requestAnimationFrame(animate);

    // 每一帧都蒙一层半透明的矩形，实现轨迹效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let p of particles) {
        p.update(particles);
    }
}

init();
animate();