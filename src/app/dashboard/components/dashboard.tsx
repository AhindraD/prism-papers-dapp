'use client';

import React, { useState, useEffect } from 'react';
import {
    Copy,
    Wallet,
    FileText,
    ShoppingBag,
    Award,
    TrendingUp,
    Calendar,
    Download,
    Hexagon,
    Activity
} from 'lucide-react';
import { fetchUser, PRISMPAPERSDAPP_PROGRAM_ADDRESS } from '@project/anchor';
import { useSolana } from '@/components/solana/use-solana';
import { USER_SEED } from '@/features/prismpapersdapp/data-access/use-init-user-mutation';
import { getProgramDerivedAddress, getAddressEncoder, address } from 'gill';
import { useWalletUi } from '@wallet-ui/react';

// --- TYPES (Matching your Rust Struct) ---
interface UserData {
    owner: string;
    name: string;
    published: number;
    purchased: number;
    sold: number;
    reviewed: number;
    earning: string; // in Lamports
    timestamp: string;
}

// --- MOCK DATA (Replace with actual Anchor fetch) ---
const MOCK_USER: UserData = {
    owner: "7Xw...3k9", // Truncated for UI
    name: "Dr. Satoshi",
    published: 12,
    purchased: 45,
    sold: 8,
    reviewed: 23,
    earning: "5400000000", // 5.4 SOL
    timestamp: "Jan 1, 2024",
};


// --- COMPONENTS ---

function DashboardGrid() {
    // A simpler, static grid for the dashboard background to reduce noise
    return (
        <div className="absolute inset-0 -z-10 h-full w-full bg-cyber-black overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[32px_32px]" />
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-cyber-purple/10 to-transparent blur-[100px]" />
        </div>
    );
}

function StatCard({ label, value, icon, delay, color = "cyber-neon" }: { label: string, value: number | string, icon: any, delay: string, color?: string }) {
    const colorClasses = {
        "cyber-neon": "text-cyber-neon border-cyber-neon/20 hover:border-cyber-neon/50",
        "cyber-pink": "text-cyber-pink border-cyber-pink/20 hover:border-cyber-pink/50",
        "cyber-purple": "text-cyber-purple border-cyber-purple/20 hover:border-cyber-purple/50",
    }[color] || "text-white border-white/20";

    return (
        <div
            className={`group relative bg-cyber-dark/80 backdrop-blur-md border p-6 rounded-2xl flex flex-col justify-between h-32 transition-all duration-300 hover:bg-white/5 animate-fade-in-up ${colorClasses}`}
            style={{ animationDelay: delay, animationFillMode: 'both' }}
        >
            <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">{label}</span>
                {React.cloneElement(icon, { className: "w-5 h-5 opacity-80" })}
            </div>
            <div className="text-4xl font-black tracking-tighter">
                {value}
            </div>
            {/* Corner Accent */}
            <div className={`absolute bottom-0 right-0 w-0 h-0 border-b-10 border-r-10 border-b-transparent border-r-current opacity-50`} />
        </div>
    );
}

function IdentityModule({ user }: { user: UserData }) {
    return (
        <section className="relative w-full max-w-6xl mx-auto pt-32 pb-12 px-6 flex flex-col md:flex-row items-end gap-8 border-b border-white/5">
            {/* Avatar Hexagon */}
            <div className="relative w-32 h-32 shrink-0 group">
                <div className="absolute inset-0 bg-cyber-neon/20 blur-2xl rounded-full animate-pulse-slow" />
                <div className="relative w-full h-full bg-cyber-gray border border-cyber-neon/30 clip-path-hexagon flex items-center justify-center overflow-hidden">
                    <span className="text-4xl font-bold text-cyber-neon">{user.name.charAt(0).toUpperCase()}</span>
                    {/* Scanline */}
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyber-neon/10 to-transparent w-full h-[20%] animate-[scan_2s_linear_infinite]" />
                </div>
                {/* Tech Deco */}
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-cyber-neon text-black text-[10px] font-bold font-mono tracking-tighter">
                    VERIFIED
                </div>
            </div>

            {/* Info Block */}
            <div className="grow mb-2">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
                        {user.name}
                    </h1>
                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">
                        Lvl. {(user.sold + user.published).toString().padStart(2, '0')}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-gray-400">
                    <div className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
                        <Wallet className="w-4 h-4 text-cyber-pink" />
                        <span>{user.owner}</span>
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyber-purple" />
                        <span>Joined: {user.timestamp}</span>
                    </div>
                </div>
            </div>

            {/* Withdraw Module (Top Right) */}
            <div className="w-full md:w-auto flex flex-col items-end gap-2">
                <div className="text-right">
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Unclaimed Rewards</div>
                    <div className="text-3xl font-bold text-cyber-neon tabular-nums">
                        {(Number(user.earning) / 1_000_000_000).toFixed(2)} <span className="text-sm text-gray-400">SOL</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-cyber-gray hover:bg-cyber-neon hover:text-black border border-cyber-neon/30 px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all group">
                    <Download className="w-4 h-4 group-hover:animate-bounce" />
                    Withdraw Funds
                </button>
            </div>
        </section>
    );
}

export default function Dashboard() {
    const { client } = useSolana();
    const { account } = useWalletUi();
    async function fetchUserStats() {
        const programAddress = address(PRISMPAPERSDAPP_PROGRAM_ADDRESS);
        if (!account) {
            return MOCK_USER;
        }
        const userAddress = address(account.address.toString());
        const [userAccountPda] = await getProgramDerivedAddress({
            programAddress,
            seeds: [
                USER_SEED,
                getAddressEncoder().encode(userAddress)
            ],
        });
        const userAccount = await fetchUser(client.rpc, userAccountPda);
        const userStats: UserData = {
            owner: userAccount.data.owner.toString(),
            name: userAccount.data.name,
            published: userAccount.data.published,
            purchased: userAccount.data.purchased,
            sold: userAccount.data.sold,
            reviewed: userAccount.data.reviewed,
            earning: userAccount.data.earning.toString(),//convert bigint to string, so React can handle it
            timestamp: new Date(Number(userAccount.data.timestamp) * 1000).toLocaleDateString(),
        };
        return userStats;
    }
    const [userStats, setUserStats] = useState<UserData>(MOCK_USER);
    useEffect(() => {
        fetchUserStats()
            .then(userStats => {
                setUserStats(userStats);
            }).catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <main className="min-h-screen bg-cyber-black text-white selection:bg-cyber-pink selection:text-white relative">
            <DashboardGrid />

            <IdentityModule user={userStats} />

            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* SECTION: SYSTEM METRICS */}
                <div className="mb-8 flex items-center gap-4">
                    <Activity className="w-5 h-5 text-cyber-pink" />
                    <h2 className="text-lg font-bold tracking-widest text-white">SYSTEM_METRICS</h2>
                    <div className="h-px grow bg-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Papers Published"
                        value={userStats.published.toString().padStart(2, '0')}
                        icon={<FileText />}
                        color="cyber-neon"
                        delay="100ms"
                    />
                    <StatCard
                        label="Access Granted"
                        value={userStats.purchased.toString().padStart(2, '0')}
                        icon={<ShoppingBag />}
                        color="cyber-purple"
                        delay="200ms"
                    />
                    <StatCard
                        label="Copies Sold"
                        value={userStats.sold.toString().padStart(2, '0')}
                        icon={<TrendingUp />}
                        color="cyber-pink"
                        delay="300ms"
                    />
                    <StatCard
                        label="Reviews Given"
                        value={userStats.reviewed.toString().padStart(2, '0')}
                        icon={<Award />}
                        color="cyber-neon"
                        delay="400ms"
                    />
                </div>

                {/* SECTION: RECENT ACTIVITY (Placeholder for visual completeness) */}
                <div className="mt-16 mb-8 flex items-center gap-4">
                    <Hexagon className="w-5 h-5 text-gray-500" />
                    <h2 className="text-lg font-bold tracking-widest text-gray-500">RECENT_TRANSMISSIONS</h2>
                    <div className="h-px grow bg-white/5" />
                </div>

                <div className="w-full h-32 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-600 font-mono text-sm">
                    [ NO RECENT ACTIVITY LOGS FOUND ]
                </div>

            </div>
        </main>
    );
}