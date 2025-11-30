import { SolanaClusterId, useWalletUi, useWalletUiCluster } from '@wallet-ui/react';
import {
    Blockhash,
    createSolanaClient,
    createTransaction,
    Instruction,
    address,
    getAddressEncoder,
    getProgramDerivedAddress,
} from 'gill'
// Import generated helpers from your SDK
import { useQuery } from '@tanstack/react-query';

import { PRISMPAPERSDAPP_PROGRAM_ADDRESS } from '@project/anchor'; 
// Import the specific account fetcher if available from your codama generation
// Otherwise we check lamports/existence via RPC
// import { fetchUser } from '@/anchor/src'; 

const USER_SEED = new TextEncoder().encode("user");

export function useIsInitialized() {
    const { account } = useWalletUi();
    const { cluster } = useWalletUiCluster();
    const PROGRAM_ID = PRISMPAPERSDAPP_PROGRAM_ADDRESS;

    // return useQuery({
    //     queryKey: ['is-user-initialized', account?.address?.toString()],
    //     enabled: !!account,
    //     queryFn: async () => {
    //         if (!account) return false;

    //         // 1. Derive the User Profile PDA
    //         // We must use the Gill/Solana-Kit address format
    //         const userAddress = address(account.address);

    //         const [userProfilePda] = await getProgramDerivedAddress({
    //             programAddress: address(PROGRAM_ID),
    //             seeds: [
    //                 USER_SEED,
    //                 getAddressEncoder().encode(userAddress)
    //             ],
    //         });

    //         // 2. Fetch the account info
    //         const accountInfo = await cluster.url.getAccountInfo(userProfilePda).send();

    //         // If account exists (not null) and has data, the user is initialized
    //         return !!accountInfo;
    //     },
    //     staleTime: 60000, // Cache for 1 minute
    // });
}