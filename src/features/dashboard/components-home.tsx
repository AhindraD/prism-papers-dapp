import React, { useState, useRef, useEffect, ReactElement } from 'react';
import {
    ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

// --- 3D MATH ENGINE (Optimized) ---
const FOCAL_LENGTH = 350;

class Point3D {
    constructor(public x: number, public y: number, public z: number) { }

    rotateX(angle: number) {
        const rad = angle * Math.PI / 180;
        const cosa = Math.cos(rad), sina = Math.sin(rad);
        return new Point3D(this.x, this.y * cosa - this.z * sina, this.y * sina + this.z * cosa);
    }

    rotateY(angle: number) {
        const rad = angle * Math.PI / 180;
        const cosa = Math.cos(rad), sina = Math.sin(rad);
        return new Point3D(this.z * sina + this.x * cosa, this.y, this.z * cosa - this.x * sina);
    }

    project(viewWidth: number, viewHeight: number) {
        const scale = FOCAL_LENGTH / (FOCAL_LENGTH + this.z + 400);
        return {
            x: viewWidth / 2 + (this.x * scale),
            y: viewHeight / 2 + (this.y * scale),
            scale
        };
    }
}

// --- COMPONENT: REALISTIC PRISM (Cyber-Glass Edition) ---
export function RealisticPrism() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let angleY = 0, angleX = 0;
        const mouse = { x: 0, y: 0 };
        let animationId: number;

        // --- UPDATED GEOMETRY: Larger Size, Less Margin ---
        const size = 200; // Increased from 140
        const depth = 300; // Increased from 220

        const baseVertices = [
            new Point3D(0, -size, -depth / 2),
            new Point3D(-size * 0.866, size / 2, -depth / 2),
            new Point3D(size * 0.866, size / 2, -depth / 2),
            new Point3D(0, -size, depth / 2),
            new Point3D(-size * 0.866, size / 2, depth / 2),
            new Point3D(size * 0.866, size / 2, depth / 2),
        ];

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = container.clientWidth * dpr;
            canvas.height = container.clientHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${container.clientWidth}px`;
            canvas.style.height = `${container.clientHeight}px`;
        };

        const updateMouse = (clientX: number, clientY: number) => {
            const rect = container.getBoundingClientRect();
            mouse.x = (clientX - rect.left - rect.width / 2) * 0.08;
            mouse.y = (clientY - rect.top - rect.height / 2) * 0.08;
        }

        const render = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            ctx.clearRect(0, 0, width, height);

            // Inertia rotation
            angleY += (mouse.x - angleY) * 0.05 + 0.3;
            angleX += (mouse.y - angleX) * 0.05;

            const projected = baseVertices.map(v => v.rotateY(angleY).rotateX(angleX).project(width, height));

            // --- 1. LIGHT BEAM (LASER STYLE) ---
            const lightStart = { x: 0, y: height * 0.3 };
            const entryPoint = {
                x: (projected[0].x + projected[1].x + projected[3].x + projected[4].x) / 4,
                y: (projected[0].y + projected[1].y + projected[3].y + projected[4].y) / 4
            };
            const exitPoint = {
                x: (projected[0].x + projected[2].x + projected[3].x + projected[5].x) / 4,
                y: (projected[0].y + projected[2].y + projected[3].y + projected[5].y) / 4
            };

            // Incoming Laser
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00f3ff'; // Cyber Cyan
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(lightStart.x, lightStart.y);
            ctx.lineTo(entryPoint.x, entryPoint.y);
            ctx.stroke();

            // Internal Beam
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#bd00ff'; // Purple
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(entryPoint.x, entryPoint.y);
            ctx.lineTo(exitPoint.x, exitPoint.y);
            ctx.stroke();

            // --- 2. SPECTRAL DISPERSION (NEON STYLE) ---
            const spectrum = ['#ff0000', '#ff0099', '#bd00ff', '#0000ff', '#00f3ff', '#00ff00'];
            const spread = 70 + Math.sin(Date.now() * 0.003) * 15; // Increased spread for bigger prism

            spectrum.forEach((color, i) => {
                ctx.shadowBlur = 30;
                ctx.shadowColor = color;
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.globalAlpha = 0.9;

                const rayTargetX = width + 200;
                const rayTargetY = exitPoint.y + (i - 2.5) * spread;

                ctx.beginPath();
                ctx.moveTo(exitPoint.x, exitPoint.y);
                ctx.bezierCurveTo(exitPoint.x + 150, exitPoint.y, rayTargetX - 300, rayTargetY, rayTargetX, rayTargetY);
                ctx.stroke();
            });
            ctx.globalAlpha = 1;

            // --- 3. PRISM CHASSIS (CYBER GLASS) ---
            const faces = [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [0, 2, 5, 3], [1, 2, 5, 4]];

            ctx.shadowBlur = 0;
            ctx.lineWidth = 1;

            faces.forEach(face => {
                ctx.beginPath();
                const start = projected[face[0]];
                ctx.moveTo(start.x, start.y);
                for (let i = 1; i < face.length; i++) ctx.lineTo(projected[face[i]].x, projected[face[i]].y);
                ctx.closePath();

                // Glassy Fill
                ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.fill();

                // Neon Edges
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.stroke();
            });

            // Vertex Highlights
            ctx.fillStyle = '#fff';
            projected.forEach(p => {
                if (Math.random() > 0.92) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#00f3ff';
                    ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
                }
            });

            animationId = requestAnimationFrame(render);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', (e) => updateMouse(e.clientX, e.clientY));
        window.addEventListener('touchmove', (e) => {
            if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
        });

        handleResize();
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}


export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
            <RealisticPrism />

            <div className="relative z-10 text-center max-w-5xl pointer-events-none">
                {/* CYBERPUNK BADGE */}
                {/* NOTE: Removed opacity-0 and added animationFillMode: both */}
                <div
                    className="pointer-events-auto inline-flex items-center gap-3 border border-white/10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-none mb-8 animate-fade-in-up"
                    style={{ animationFillMode: 'both' }}
                >
                    <span className="w-2 h-2 bg-cyber-pink rounded-full animate-ping" />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-cyber-neon uppercase">Solana DeSci Network</span>
                </div>


                {/* MASSIVE TYPOGRAPHY */}
                {/* Removed mix-blend-difference and opacity-0 */}
                <h1
                    className="text-6xl md:text-[8rem] font-black leading-[0.9] tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500 animate-fade-in-up text-center"
                    style={{ animationDelay: '100ms', animationFillMode: 'both', opacity: 0.44 }}
                >
                    SCIENCE <br />
                    <span className="text-stroke">UNLOCKED</span>
                </h1>

                {/* ACTION BUTTONS */}
                <div
                    className="pointer-events-auto mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up"
                    style={{ animationDelay: '500ms', animationFillMode: 'both' }}
                >
                    <Link href="/papers" className="group relative px-8 py-4 bg-cyber-neon text-white font-bold text-sm tracking-widest uppercase overflow-hidden hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.4)]">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative flex items-center gap-2">Start Reading <ArrowUpRight className="w-4 h-4" /></span>
                    </Link>
                    <Link href="/publish" className="px-8 py-4 border border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/5 transition-colors hover:border-cyber-pink">
                        Publish Research
                    </Link>
                </div>
            </div>
        </section >
    )
}

export function StatsBar() {
    return (
        <div className="border-y border-white/10 bg-cyber-black/50 backdrop-blur-sm relative z-20">

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                {[
                    { label: "// Platform Fee", val: "05%" },
                    { label: "// Author Share", val: "95%" },
                    { label: "// Review Speed", val: "<24H" },
                    { label: "// Encryption", val: "AES" }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center border-l border-white/10 first:border-l-0 pl-6 group cursor-default">
                        <span className="font-mono text-cyber-pink text-xs mb-2 group-hover:text-white transition-colors">0{i + 1}  {stat.label}</span>
                        <span className="text-4xl md:text-5xl font-black text-white tracking-tighter group-hover:text-cyber-neon transition-colors">{stat.val}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- NEW COMPONENT: LIVE ENCRYPTION TITLE (SMOOTHER) ---
const EncryptionTitle = ({ text }: { text: string }) => {
    const [displayText, setDisplayText] = useState(text);
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scramble = () => {
        let iteration = 0;
        clearInterval(intervalRef.current as NodeJS.Timeout);

        intervalRef.current = setInterval(() => {
            setDisplayText(
                text
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) return text[index];
                        if (char === " ") return " ";
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current as NodeJS.Timeout);
            }

            // Slower resolution increment for more "matrix" frames
            iteration += 1 / 2;
        }, 60);
    };

    return (
        <h2
            onMouseEnter={scramble}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter cursor-default hover:text-cyber-neon transition-colors"
        >
            {displayText}
        </h2>
    );
};


export function AboutSection() {
    return (
        <section className="py-32 relative z-20 px-6 text-center">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 flex flex-col items-center justify-center gap-4">
                    <span className="font-mono text-xs text-cyber-pink mb-2 opacity-80 animate-pulse">{"// SYSTEM_IDENTITY "}</span>

                    {/* LIVE ENCRYPTION TITLE */}
                    <EncryptionTitle text="PRISM PAPERS" />

                    <div className="w-24 h-1 bg-linear-to-r from-transparent via-cyber-neon to-transparent mt-4" />
                </div>

                <div className="prose prose-invert mx-auto">
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                        We are the <span className="text-cyber-neon font-bold">refraction point</span> for modern science.
                        We take the raw beam of academic research and split it into a spectrum of
                        <span className="text-cyber-pink font-bold"> transparency</span>,
                        <span className="text-cyber-pink font-bold"> ownership</span>, and
                        <span className="text-cyber-pink font-bold"> infinite access</span>.
                    </p>
                    <p className="mt-8 text-lg text-gray-500 font-mono">
                        [ NO GATEKEEPERS. NO PAYWALLS THAT DON&apos;T PAY. JUST PURE, ENCRYPTED KNOWLEDGE. ]
                    </p>
                </div>
            </div>
        </section>
    )
}