import { Hexagon, Github } from "lucide-react";

export function AppFooter() {
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
                        hover:bg-linear-to-r hover:from-cyber-neon hover:via-white hover:to-cyber-pink">
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
            <span className="font-bold text-sm tracking-wide text-gray-400 bg-clip-text transition-all duration-500 hover:text-transparent hover:bg-linear-to-r hover:from-cyber-pink hover:via-white hover:to-cyber-neon">
              AhindraD
            </span>
            <Github className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
          </a>
        </div>

      </div>
    </footer>
  )
}
