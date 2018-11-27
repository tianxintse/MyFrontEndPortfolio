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

function rotateVelocity(v, theta) {
    return {
        x: v.x * Math.cos(theta) - v.y * Math.sin(theta),
        y: v.y * Math.cos(theta) + v.x * Math.sin(theta)
    };
}

function resolveCollision(p1, p2) {
    let xVelDiff = p2.dx - p1.dx;
    let yVelDiff = p2.dy - p1.dy;
    let xDist = p1.x - p2.x;
    let yDist = p1.y - p2.y;

    if (xVelDiff * xDist + yVelDiff * yDist > 0) {

        let v1 = {
            x: p1.dx,
            y: p1.dy
        };
        let v2 = {
            x: p2.dx,
            y: p2.dy
        };

        let theta = -Math.atan2(p1.y - p2.y, p1.x - p2.x);

        // rotate to the new coordinate system that suitable for 1D elastic collision
        let rotatedV1 = rotateVelocity(v1, theta);
        let rotatedV2 = rotateVelocity(v2, theta);

        // calculate velocity after collision
        let rotatedV1AfterCollision = {
            x: (rotatedV1.x * (p1.mass - p2.mass) + 2 * p2.mass * rotatedV2.x) / (p1.mass + p2.mass),
            y: rotatedV1.y
        };
        let rotatedV2AfterCollision = {
            x: (rotatedV2.x * (p2.mass - p1.mass) + 2 * p1.mass * rotatedV1.x) / (p1.mass + p2.mass),
            y: rotatedV2.y
        };

        // rotate back
        let v1AfterCollision = rotateVelocity(rotatedV1AfterCollision, -theta);
        let v2AfterCollision = rotateVelocity(rotatedV2AfterCollision, -theta);

        p1.dx = v1AfterCollision.x;
        p1.dy = v1AfterCollision.y;
        p2.dx = v2AfterCollision.x;
        p2.dy = v2AfterCollision.y;
    }
}


/**
 * 颜色数组
 */
let colorArray = [
    'rgba(247, 71, 59, ',
    'rgba(59, 139, 136, ',
    'rgba(242, 193, 78, ',
    'rgba(247, 129, 84, ',
    'rgba(33, 118, 174, '
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

let ctx = canvas.getContext('2d');
let globalAlpha = 0.3;


function Particle(x, y, dx, dy, radius, mass, color, oppacity) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.mass = mass;
    this.color = color;
    this.oppacity = oppacity;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.oppacity + ')';
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

        if (getDistance(this.x, this.y, mouse.x, mouse.y) < 100) {
            this.oppacity = 1;
        } else {
            this.oppacity = globalAlpha;
        }

        this.draw();
    }
}

let particles;

function init() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        let radius = randomIntFromRange(10, 20);
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
        particles.push(new Particle(x, y, dx, dy, radius, mass, color, globalAlpha));
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