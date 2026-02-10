import confetti from "canvas-confetti";

export function fireConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = ["#ff6b9d", "#c44569", "#ff4757", "#ff6348", "#ffa502", "#ff78cb"];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
