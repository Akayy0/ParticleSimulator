const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Atualiza as posições base das partículas quando a tela é redimensionada
    for (const particle of particles) {
        particle.baseX = Math.random() * canvas.width;
        particle.baseY = Math.random() * canvas.height;
    }
});

let isMousePressed = false;
let disableMouseAttraction = false;

window.addEventListener('mousedown', () => {
    isMousePressed = true;
    disableMouseAttraction = true;
});

window.addEventListener('mouseup', () => {
    isMousePressed = false;
    disableMouseAttraction = false;
});

class Particle {
    constructor(x, y, radius, color, explosionIntensity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.baseX = x; // Posição original
        this.baseY = y;
        this.velocity = 0.02; // Velocidade de movimento em direção ao mouse
        this.influenceRadius = 120;
        this.drift = 0.5;
        this.speed = 1;
        this.direction = Math.random() * 2 * Math.PI;
        this.explosionIntensity = explosionIntensity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(mouse) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);

        if (distance < this.influenceRadius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (distance - this.radius) * this.velocity; // Reduzi o impacto do mouse

            this.x += forceDirectionX * force;
            this.y += forceDirectionY * force;
        }

        this.x += (Math.random() - 0.5) * this.drift;
        this.y += (Math.random() - 0.5) * this.drift;

        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;

        if (Math.random() < 0.02) {
            this.direction = Math.random() * 2 * Math.PI;
        }

        const explosionRadius = 200; // Raio da região de afastamento
        const explosionForce = 0.05; // Força do afastamento

        if (isMousePressed && distance < explosionRadius) {
            // Ajuste a força para criar um efeito mais lento de afastamento
            const force = explosionForce * (explosionRadius - distance);

            this.x -= dx / distance * force;
            this.y -= dy / distance * force;
        } else {
            // Lógica de atração quando o mouse não está pressionado
            if (!disableMouseAttraction && distance < this.influenceRadius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (distance - this.radius) * this.velocity;

                this.x += forceDirectionX * force;
                this.y += forceDirectionY * force;
            }
        }

        this.draw();
    }
}

function decreasingFunction(distance, maxDistance) {
    // Função que diminui a influência à medida que a distância aumenta
    const normalizedDistance = Math.min(distance, maxDistance) / maxDistance;
    return Math.max(0, 1 - normalizedDistance);
}

const particles = [];

function createParticles() {
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 2;
        const color = 'rgba(0, 0, 0, 1)';

        // Ajuste a intensidade da explosão conforme desejado
        const explosionIntensity = 50;

        particles.push(new Particle(x, y, radius, color, explosionIntensity));
    }
}

function animate(mouse) {
    requestAnimationFrame(() => animate(mouse));
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
        particle.update(mouse);
    }
}

createParticles();

// Adiciona evento de mousemove para obter a posição do mouse
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

animate(mouse);