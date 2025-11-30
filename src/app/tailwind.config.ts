import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                cyber: {
                    black: "#050505",
                    dark: "#0a0a0f",
                    gray: "#181820",
                    neon: "#00f3ff", // Cyan
                    pink: "#ff0099", // Hot Pink
                    purple: "#bd00ff",
                },
            },
            fontFamily: {
                mono: ['var(--font-geist-mono)', 'monospace'],
            },
            backgroundImage: {
                "cyber-gradient": "linear-gradient(to right, #00f3ff, #bd00ff, #ff0099)",
                "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
            },
            keyframes: {
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(40px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "glitch": {
                    "0%": { transform: "translate(0)" },
                    "20%": { transform: "translate(-2px, 2px)" },
                    "40%": { transform: "translate(-2px, -2px)" },
                    "60%": { transform: "translate(2px, 2px)" },
                    "80%": { transform: "translate(2px, -2px)" },
                    "100%": { transform: "translate(0)" },
                },
                "pulse-slow": {
                    "0%, 100%": { opacity: "0.5" },
                    "50%": { opacity: "1" },
                },
                // Text Shimmer for Footer Links
                "text-shimmer": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "100%": { backgroundPosition: "100% 50%" },
                },
            },
            animation: {
                "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                "glitch": "glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite",
                "pulse-slow": "pulse-slow 4s ease-in-out infinite",
                "text-shimmer": "text-shimmer 2.5s ease-out infinite alternate",
            },
        },
    },
    plugins: [],
};
export default config;