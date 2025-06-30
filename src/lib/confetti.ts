import confetti from 'canvas-confetti'

export function triggerConfetti() {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        triggerFountainEffect();
    } else {
        triggerFireworksEffect();
    }
}

// Animation for large screens (Desktop)
function triggerFireworksEffect() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const baseParticleCount = 50;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = baseParticleCount * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}

// Animation for small screens (Mobile)
function triggerFountainEffect() {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const baseParticleCount = 25;

    const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = baseParticleCount * (timeLeft / duration);
        confetti({
            startVelocity: 45,
            spread: 100,
            particleCount: particleCount,
            origin: { x: 0.5, y: 1 },
            zIndex: 0,
        });
    }, 250);
}