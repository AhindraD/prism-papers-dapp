'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Menu, X, Hexagon } from 'lucide-react';
import { ThemeSelect } from '@/components/theme-select';
import { WalletDropdown } from '@/components/wallet-dropdown';

const ClusterDropdown = dynamic(() => import('@/components/cluster-dropdown').then((m) => m.ClusterDropdown), {
  ssr: false,
})

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <div className="pointer-events-auto flex items-center justify-between gap-4 md:gap-8 bg-cyber-gray/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)] w-full max-w-6xl transition-all duration-300 hover:border-white/20">

        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <Hexagon className="w-6 h-6 text-cyber-neon fill-cyber-neon/20 animate-pulse group-hover:rotate-90 transition-transform duration-500" />
            <span className="font-bold tracking-widest text-lg text-white group-hover:text-cyber-neon transition-colors">
              PRISM<span className="text-gray-500 group-hover:text-white transition-colors">PAPERS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center ml-6">
            <div className="w-px h-6 bg-white/10 mr-6" />
            <ul className="flex gap-8">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    href={path}
                    className={`font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isActive(path)
                      ? 'text-cyber-neon drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]'
                      : 'text-gray-400 hover:text-cyber-pink hover:scale-105'
                      }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="scale-90 opacity-80 hover:opacity-100 transition-opacity">
            <ClusterDropdown />
          </div>
          {/* <div className="scale-90 opacity-80 hover:opacity-100 transition-opacity">
            <ThemeSelect />
          </div> */}

          {/* Wallet Container - Styled to integrate with the pill */}
          <div className="pl-4 border-l border-white/10">
            <WalletDropdown />
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-cyber-neon hover:text-white transition-colors p-1"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu Dropdown */}
        {showMenu && (
          <div className="absolute top-[calc(100%+1rem)] left-0 right-0 bg-cyber-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 animate-fade-in-up origin-top">
            <ul className="flex flex-col gap-4">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    href={path}
                    className={`block text-lg font-mono font-bold uppercase tracking-widest py-3 border-b border-white/5 ${isActive(path)
                      ? 'text-cyber-neon pl-4 border-l-2 border-cyber-neon bg-white/5'
                      : 'text-gray-400 hover:text-white hover:pl-2 transition-all'
                      }`}
                    onClick={() => setShowMenu(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 pt-2">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Network</span>
                <ClusterDropdown />
              </div>
              {/* <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Theme</span>
                <ThemeSelect />
              </div> */}
              <div className="mt-2 w-full [&>button]:w-full">
                <WalletDropdown />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}