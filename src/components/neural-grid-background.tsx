import { useRef, useEffect } from "react";

export function NeuralGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let points: { x: number, y: number, originX: number, originY: number, color: string, active: number }[] = [];
        let animationId: number;

        // Cyberpunk palette
        const colors = ['#00f3ff', '#ff0099', '#bd00ff', '#ffffff'];

        const initPoints = (w: number, h: number) => {
            points = [];
            // Dense grid
            const gap = 40;
            for (let x = 0; x < w; x += gap) {
                for (let y = 0; y < h; y += gap) {
                    points.push({
                        x, y,
                        originX: x, originY: y,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        active: 0
                    });
                }
            }
        };

        const handleResize = () => {
            if (!containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = clientWidth * dpr;
            canvas.height = clientHeight * dpr;
            ctx.scale(dpr, dpr);
            initPoints(clientWidth, clientHeight);
        };

        const animate = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            ctx.clearRect(0, 0, width, height);

            points.forEach(p => {
                // Distance to mouse
                const dx = p.x - mouse.current.x;
                const dy = p.y - mouse.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 200;

                // React to mouse: Push away + Activate color
                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    const angle = Math.atan2(dy, dx);
                    // "Explosion" effect
                    p.x += Math.cos(angle) * force * 5;
                    p.y += Math.sin(angle) * force * 5;
                    p.active = 1; // Full activation
                }

                // Return to origin (Elastic)
                p.x += (p.originX - p.x) * 0.1;
                p.y += (p.originY - p.y) * 0.1;
                p.active *= 0.95; // Decay activation

                // Draw
                const size = p.active > 0.1 ? 2 + p.active * 2 : 1;
                ctx.fillStyle = p.active > 0.1 ? p.color : '#1a1a1a'; // Grey when inactive, neon when active

                ctx.beginPath();
                if (p.active > 0.1) {
                    // Glow when active
                    ctx.shadowBlur = 10 * p.active;
                    ctx.shadowColor = p.color;
                } else {
                    ctx.shadowBlur = 0;
                }

                // Draw as small squares for "digital" feel
                ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
            });

            // Draw connecting lines only for active points (Neural effect)
            ctx.shadowBlur = 0;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < points.length; i++) {
                const p1 = points[i];
                if (p1.active < 0.2) continue; // Optimization

                // Only check neighbors roughly
                for (let j = i + 1; j < points.length; j++) {
                    const p2 = points[j];
                    if (p2.active < 0.2) continue;

                    const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                    if (dist < 60) {
                        ctx.strokeStyle = `rgba(0, 243, 255, ${p1.active * 0.5})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            }
        });
        // Mobile Touch Support
        window.addEventListener('touchmove', (e) => {
            if (containerRef.current && e.touches[0]) {
                const rect = containerRef.current.getBoundingClientRect();
                mouse.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
            }
        });

        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 z-[-1]">
            <canvas ref={canvasRef} className="block w-full h-full opacity-60" />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)] pointer-events-none" />
        </div>
    );
}