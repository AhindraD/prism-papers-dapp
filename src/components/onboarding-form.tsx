'use client';

import { useState } from 'react';
import { useWalletUi } from '@wallet-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, UserPlus } from 'lucide-react';
import { useInitUserMutation } from '@/features/prismpapersdapp/data-access/instructions/use-init-user-mutation';



export function OnboardingForm() {
    const { account } = useWalletUi();
    const queryClient = useQueryClient();

    const [name, setName] = useState('');

    // 2. Call the Mutation Hook at the TOP LEVEL
    // We pass the account. If account is undefined, we assume the parent guard prevents rendering,
    // or we cast it if we are sure.
    const initUserMutation = useInitUserMutation({
        account: account!
    });

    const handleInitialize = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!account || !name) return;

        try {
            // 3. Trigger the mutation function (Async)
            await initUserMutation.mutateAsync({ name });

            // 4. Invalidate query to trigger UI update in UserGuard
            await queryClient.invalidateQueries({ queryKey: ['is-user-initialized'] });

        } catch (error) {
            // Errors are handled in the mutation hook's onError, 
            // but we catch here to prevent unhandled promise rejections if needed
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="space-y-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                    <UserPlus className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Welcome to Prism Papers
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    To start publishing or reviewing research, please create your researcher profile.
                </p>
            </div>

            <div className="w-full max-w-sm space-y-4 border rounded-xl p-6 bg-card shadow-sm">
                <form onSubmit={handleInitialize} className="space-y-4">
                    <div className="space-y-2 text-left">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Display Name
                        </label>
                        <input
                            id="name"
                            placeholder="e.g. Dr. Alice Smith"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            minLength={3}
                            maxLength={50}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={initUserMutation.isPending || !name}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                    >
                        {initUserMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Profile...
                            </>
                        ) : (
                            "Create Profile"
                        )}
                    </button>
                </form>
                <p className="text-xs text-muted-foreground text-center">
                    This will create an on-chain account and a secure vault for your earnings.
                </p>
            </div>
        </div>
    );
}


