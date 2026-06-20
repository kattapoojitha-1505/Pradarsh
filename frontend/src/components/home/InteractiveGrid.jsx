import React, { useEffect, useRef } from 'react';

export default function InteractiveGrid() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const mouse = { x: -1000, y: -1000, radius: 180 };
        const spacing = 40;
        let points = [];

        const initPoints = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            points = [];
            for (let x = 0; x <= canvas.width + spacing; x += spacing) {
                for (let y = 0; y <= canvas.height + spacing; y += spacing) {
                    points.push({ x, y, originX: x, originY: y });
                }
            }
        };

        const handleMouseMove = (e) => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('resize', initPoints);
        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        initPoints();

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Neon Green color for the interactive dots
            ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';

            for (let i = 0; i < points.length; i++) {
                let p = points[i];
                let dx = p.originX - mouse.x;
                let dy = p.originY - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    let force = Math.sin((distance / mouse.radius) * Math.PI);
                    let distortion = (mouse.radius - distance) * 0.3;
                    p.x = p.originX + (dx / distance) * distortion;
                    p.y = p.originY + (dy / distance) * distortion;
                } else {
                    p.x += (p.originX - p.x) * 0.1;
                    p.y += (p.originY - p.y) * 0.1;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', initPoints);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
            style={{ zIndex: 0 }}
        />
    );
}