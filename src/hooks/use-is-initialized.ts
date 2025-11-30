import { useWalletUi, useWalletUiCluster } from '@wallet-ui/react';
import {
    createSolanaClient,
    address,
    getAddressEncoder,
    getProgramDerivedAddress,
} from 'gill'
// Import generated helpers from your SDK
import { useQuery } from '@tanstack/react-query';

import { PRISMPAPERSDAPP_PROGRAM_ADDRESS } from '@project/anchor';


const USER_SEED = new TextEncoder().encode("user");

export function useIsInitialized() {
    const { account } = useWalletUi();
    const { rpc } = createSolanaClient({
        urlOrMoniker: "devnet",
    });

    const { data: isInitialized, isLoading } = useQuery({
        queryKey: ['is-user-initialized', account?.address.toString()],
        enabled: !!account,
        queryFn: async () => {
            if (!account) return false;
            const userAddress = address(account.address.toString());
            const programAddress = address(PRISMPAPERSDAPP_PROGRAM_ADDRESS);

            const [userAccountPda] = await getProgramDerivedAddress({
                programAddress,
                seeds: [
                    USER_SEED,
                    getAddressEncoder().encode(userAddress)
                ],
            });

            // Fetch the account information
            const accountInfo = await rpc.getAccountInfo(userAccountPda).send();
            return accountInfo.value !== null;
        }
    });

    return {
        isInitialized,
        isLoading,
    };
}
