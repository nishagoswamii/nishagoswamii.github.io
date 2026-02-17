
import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    r: number;
    speed: number;
    opacity: number;
    swing: number;
    swingRate: number;
    phase: number;
}

export function GridBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let particles: Particle[] = [];
        let animationFrameId: number;
        let time = 0;

        const config = {
            particleCount: Math.floor((width * height) / 12000), // Balanced density
            connectionDistance: 120,
            baseSpeed: 0.15,
            rangeSpeed: 0.3,
        };

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            config.particleCount = Math.floor((width * height) / 12000);

            particles = Array.from({ length: config.particleCount }).map(() => createParticle(true));
        };

        const createParticle = (randomY = false): Particle => {
            return {
                x: Math.random() * width,
                y: randomY ? Math.random() * height : height + 20,
                r: Math.random() * 1.5 + 0.5,
                speed: config.baseSpeed + Math.random() * config.rangeSpeed,
                opacity: Math.random() * 0.5 + 0.3,
                swing: Math.random() * 30,
                swingRate: Math.random() * 0.01 + 0.002,
                phase: Math.random() * Math.PI * 2,
            };
        };

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            const isDark = document.documentElement.classList.contains('dark');
            const baseRgb = isDark ? '255, 255, 255' : '10, 10, 10';

            time += 0.05;

            // Update Particles
            particles.forEach((p, i) => {
                p.y -= p.speed;
                // Gentle sway
                const swingOffset = Math.sin(time * p.swingRate + p.phase) * (p.swing * 0.2);
                const x = p.x + swingOffset;
                const y = p.y;

                // Reset if off screen
                if (p.y < -50) {
                    particles[i] = createParticle();
                }

                // Draw Star
                ctx.beginPath();
                ctx.arc(x, y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${baseRgb}, ${p.opacity})`;
                ctx.fill();

                // Connect Constellations
                // Optimization: Only check a subset or purely spatial lookup would be better, 
                // but for <150 particles n^2 is fine.
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const swingOffset2 = Math.sin(time * p2.swingRate + p2.phase) * (p2.swing * 0.2);
                    const x2 = p2.x + swingOffset2;
                    const y2 = p2.y;

                    const dx = x - x2;
                    const dy = y - y2;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < config.connectionDistance) {
                        const opacity = (1 - dist / config.connectionDistance) * p.opacity * p2.opacity;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x2, y2);
                        ctx.strokeStyle = `rgba(${baseRgb}, ${opacity * 0.4})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        init();
        draw();

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none bg-background transition-colors duration-300 blur-[1px]"
        />
    );
}
