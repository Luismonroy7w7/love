let pinchStrength = 0; // 0 a 1
let smoothedPinch = 0;

let handX = 0.5;
let handY = 0.5;

const video = document.getElementById("video");

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.8,
    minTrackingConfidence: 0.8
});

hands.onResults(results => {
    if (results.multiHandLandmarks.length > 0) {
        const lm = results.multiHandLandmarks[0];

        // Centro de la mano
        handX = lm[9].x;
        handY = lm[9].y;

        // Pulgar (4) e índice (8)
        const dx = lm[8].x - lm[4].x;
        const dy = lm[8].y - lm[4].y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        // Normalizar (ajusta estos valores si quieres)
        let raw = 1 - (dist / 0.25);
        raw = Math.max(0, Math.min(1, raw));

        // SUAVIZADO (clave 🔥)
        smoothedPinch += (raw - smoothedPinch) * 0.2;

        pinchStrength = smoothedPinch;
    } else {
        // Si no hay mano, se relaja
        pinchStrength *= 0.9;
    }
});

const camera = new Camera(video, {
    onFrame: async () => {
        await hands.send({ image: video });
    },
    width: 640,
    height: 480
});

camera.start();