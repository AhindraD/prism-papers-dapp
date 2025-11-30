'use client';
import { useWalletUi, useWalletUiCluster } from '@wallet-ui/react';
import { OnboardingForm } from '@/components/onboarding-form';
import { Loader2, Wallet } from 'lucide-react';
import { WalletDropdown } from './wallet-dropdown';
import { useIsInitialized } from '@/hooks/use-is-initialized';

export function UserGuard({ children }: { children: React.ReactNode }) {
    const { account } = useWalletUi();
    const { isInitialized, isLoading } = useIsInitialized();

    // Check if user is initialized
    if (!account) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                        Connect Wallet
                    </h1>
                    <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                        You need to connect your Solana wallet to view this content.
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                        Supported wallets: Phantom, Solflare, Backpack, and more.
                    </p>
                </div>
                <div className="w-full max-w-sm flex justify-center">
                    <WalletDropdown />
                </div>
            </div>
        );
    }



    // 2. Loading State
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Verifying profile...</p>
            </div>
        );
    }

    // 3. Connected but Not Initialized -> Show Onboarding Form
    if (!isInitialized) {
        return <OnboardingForm />;
    }

    return <>{children}</>;
}
