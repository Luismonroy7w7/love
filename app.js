const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const message = document.getElementById("message");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let scale = 15;
let beating = 0;

function heartShape(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y: -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t))
    };
}

// Crear partículas
for (let i = 0; i < 800; i++) {
    let t = Math.random() * Math.PI * 2;
    let pos = heartShape(t);

    particles.push({
        baseX: pos.x,
        baseY: pos.y,
        x: pos.x,
        y: pos.y
    });
}

// Resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Latido MUY sutil
    beating += 0.03;
    let pulse = 1 + Math.sin(beating) * 0.05;

    let squeeze = typeof pinchStrength !== "undefined" ? pinchStrength : 0;

    ctx.save();

    let cx = canvas.width * (handX || 0.5);
    let cy = canvas.height * (handY || 0.5);

    ctx.translate(cx, cy);

    // Escala suave
    ctx.scale(scale * pulse * (1 - squeeze * 0.2), scale * pulse * (1 - squeeze * 0.2));

    particles.forEach(p => {

        // Objetivo limpio (sin física)
        let targetX = p.baseX * (1 - squeeze);
        let targetY = p.baseY * (1 - squeeze);

        // Interpolación suave (clave 🔥)
        p.x += (targetX - p.x) * 0.08;
        p.y += (targetY - p.y) * 0.08;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.12, 0, Math.PI * 2);
        ctx.fillStyle = "#ff2d55"; // rojo elegante tipo iOS
        ctx.fill();
    });

    ctx.restore();

    // Texto minimalista
    if (squeeze > 0.6) {
        message.innerText = "💔";
    } else {
        message.innerText = "❤️";
    }

    requestAnimationFrame(animate);
}

animate();