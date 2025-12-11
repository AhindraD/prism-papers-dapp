import { useQuery } from '@tanstack/react-query';
import { fetchUser, PRISMPAPERSDAPP_PROGRAM_ADDRESS } from '@project/anchor'; 
import { UiWalletAccount } from '@wallet-ui/react';
import { address, getAddressEncoder, getProgramDerivedAddress } from 'gill';
import { useSolana } from '@/components/solana/use-solana'; 
import { USER_SEED } from '../seeds';

// Define the return type matches your UI needs
export interface UserData {
    owner: string;
    name: string;
    published: number;
    purchased: number;
    sold: number;
    reviewed: number;
    earning: string;
    timestamp: string;
}

export function useUserQuery({ account }: { account: UiWalletAccount | undefined }) {
    const { client } = useSolana();

    return useQuery({
        // Unique key: refetches automatically when account address changes
        queryKey: ['prism-user', account?.address.toString()],

        // Only run this query if wallet is connected and client is ready
        enabled: !!account && !!client,

        queryFn: async (): Promise<UserData | null> => {
            if (!account || !client) return null;

            const userAddress = address(account.address.toString());
            const programAddress = address(PRISMPAPERSDAPP_PROGRAM_ADDRESS);

            // 1. Derive PDA
            const [userAccountPda] = await getProgramDerivedAddress({
                programAddress,
                seeds: [
                    USER_SEED,
                    getAddressEncoder().encode(userAddress)
                ],
            });

            // 2. Fetch Account using the generated helper
            // This will throw if the account does not exist (user hasn't registered)
            const userAccount = await fetchUser(client.rpc, userAccountPda);

            // 3. Format Data for UI
            return {
                owner: userAccount.data.owner.toString(),
                name: userAccount.data.name,
                published: userAccount.data.published,
                purchased: userAccount.data.purchased,
                sold: userAccount.data.sold,
                reviewed: userAccount.data.reviewed,
                earning: userAccount.data.earning.toString(), // Handle BigInt
                timestamp: new Date(Number(userAccount.data.timestamp) * 1000).toLocaleDateString(),
            };
        },
        // Optional: Do not retry if it fails (e.g., account doesn't exist yet)
        retry: false,
    });
}