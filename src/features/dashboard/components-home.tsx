import React, { useState, useRef, useEffect, ReactElement } from 'react';
import {
    ShieldCheck,
    Coins,
    ChevronRight,
    Github,
    Twitter,
    ArrowUpRight,
    Cpu,
    Hexagon,
    Lock,
    Eye,
    MessageSquareCode,
    Code,
    Wallet
} from 'lucide-react';

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

// --- COMPONENT: NEURAL GLITCH GRID (Background) ---
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

// --- UI COMPONENTS (Cyber-Portfolio Style) ---

export function NavBar() {
    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-8 bg-cyber-gray/80 backdrop-blur-md border border-white/10 px-8 py-3 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <div className="flex items-center gap-2">
                    <Hexagon className="w-5 h-5 text-cyber-neon fill-cyber-neon/20 animate-pulse" />
                    <span className="font-bold tracking-widest text-sm text-white">PRISM</span>
                </div>
                <div className="w-[1px] h-4 bg-white/20" />
                <div className="hidden md:flex gap-6 text-xs font-mono text-gray-400">
                    {['ACCOUNT', 'PUBLISH', 'PROTOCOL'].map(item => (
                        <a key={item} href="#" className="hover:text-cyber-pink transition-colors uppercase tracking-wider font-bold">{item}</a>
                    ))}
                </div>

                {/* Fancy Sign In Button */}
                <button className="group relative flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-cyber-neon transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] overflow-hidden">
                    <div className="absolute inset-0 bg-cyber-pink/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    <Wallet className="w-4 h-4 relative z-10" />
                    <span className="relative z-10 tracking-wider">ESTABLISH_UPLINK</span>
                </button>
            </div>
        </nav>
    )
}

export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
            <RealisticPrism />

            <div className="relative z-10 text-center max-w-5xl pointer-events-none">
                {/* CYBERPUNK BADGE */}
                <div className="pointer-events-auto inline-flex items-center gap-3 border border-white/10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-none mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 bg-cyber-pink rounded-full animate-ping" />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-cyber-neon uppercase">Solana DeSci Network</span>
                </div>

                {/* MASSIVE TYPOGRAPHY */}
                <h1 className="text-6xl md:text-[8rem] font-black leading-[0.9] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mix-blend-difference text-center">
                    SCIENCE <br />
                    <span className="text-stroke">UNLOCKED</span>
                </h1>

                <p className="mt-8 max-w-xl mx-auto text-gray-400 font-mono text-sm md:text-base leading-relaxed animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards text-center">
                    Encrypted publishing. <br />
                    Token-gated peer review. <br />
                    95% revenue to authors.
                </p>

                {/* ACTION BUTTONS */}
                <div className="pointer-events-auto mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up [animation-delay:500ms] opacity-0 fill-mode-forwards">
                    <button className="group relative px-8 py-4 bg-cyber-neon text-black font-bold text-sm tracking-widest uppercase overflow-hidden hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.4)]">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative flex items-center gap-2">Start Reading <ArrowUpRight className="w-4 h-4" /></span>
                    </button>
                    <button className="px-8 py-4 border border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/5 transition-colors hover:border-cyber-pink">
                        Publish Research
                    </button>
                </div>
            </div>
        </section>
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

// --- UPDATED FOOTER WITH SMOOTH COLOR ANIMATIONS ---
export function Footer() {
    return (
        <footer className="py-12 border-t border-white/10 relative z-20 bg-cyber-black">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

                {/* LEFT: Sponsors */}
                <div className="flex flex-col items-center md:items-start gap-2">
                    <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Sponsored By</span>
                    <a
                        href="https://solana.org/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 group"
                    >
                        {/* Simple Solana Logo Path */}
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.8c-5.8 0-8.7-7-4.6-11.1l62.4-62.7zM332.1 73.1c-2.4 2.4-5.7 3.8-9.2 3.8H5.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7zM332.1 155.5c-2.4 2.4-5.7 3.8-9.2 3.8H5.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7z" fill="currentColor" />
                        </svg>

                        {/* Smooth Color Animation Text */}
                        <span className="font-bold text-sm tracking-wide text-gray-400 bg-clip-text transition-all duration-500
                        hover:text-transparent
                        hover:bg-gradient-to-r hover:from-cyber-neon hover:via-white hover:to-cyber-pink">
                            SOLANA FOUNDATION
                        </span>
                    </a>
                </div>

                {/* CENTER: Brand */}
                <div className="flex flex-col items-center gap-2">
                    <Hexagon className="w-8 h-8 text-cyber-gray fill-cyber-gray" />
                    <p className="font-mono text-xs text-gray-600 uppercase tracking-widest text-center">
                        PrismPapers // DeSci Protocol v1.0 <br />
                        2025
                    </p>
                </div>

                {/* RIGHT: Engineer */}
                <div className="flex flex-col items-center md:items-end gap-2">
                    <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Engineered By</span>
                    <a
                        href="https://github.com/AhindraD"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 group"
                    >
                        {/* Smooth Color Animation Text */}
                        <span className="font-bold text-sm tracking-wide text-gray-400 bg-clip-text transition-all duration-500 hover:text-transparent hover:bg-gradient-to-r hover:from-cyber-pink hover:via-white hover:to-cyber-neon">
                            AhindraD
                        </span>
                        <Github className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                    </a>
                </div>

            </div>
        </footer>
    )
}

export function AboutSection() {
    return (
        <section className="py-32 relative z-20 px-6 text-center">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 flex flex-col items-center justify-center gap-4">
                    <span className="font-mono text-xs text-cyber-pink mb-2 opacity-80 animate-pulse">{"// SYSTEM_IDENTITY "}</span>

                    {/* LIVE ENCRYPTION TITLE */}
                    <EncryptionTitle text="PRISM PAPERS" />

                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyber-neon to-transparent mt-4" />
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