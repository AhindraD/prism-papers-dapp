import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getInitUserInstruction } from '@project/anchor'
import { UiWalletAccount, useWalletUiSigner, useWalletUiCluster } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { address, getAddressEncoder, getProgramDerivedAddress } from 'gill'

const USER_SEED = new TextEncoder().encode("user");
const VAULT_USER_SEED = new TextEncoder().encode("vault_user");

export function useInitUserMutation({ account }: { account: UiWalletAccount }) {
  // 1. Hooks are called here (Top level of this custom hook)
  console.log(account.address.toString())
  const txSigner = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()
  const { cluster } = useWalletUiCluster()

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const userAddress = address(account.address.toString());

      // Ensure we use the correct program ID address
      const programAddress = address("2nvhRn83KBxkkAfLH64meTq8cYB5aRLnZVbsxZdgfPTv");

      // 2. Derive PDAs
      const [userAccount] = await getProgramDerivedAddress({
        programAddress,
        seeds: [USER_SEED, getAddressEncoder().encode(userAddress)],
      });
      const [userVault] = await getProgramDerivedAddress({
        programAddress,
        seeds: [VAULT_USER_SEED, getAddressEncoder().encode(userAddress)],
      });

      // 3. Create Instruction
      const instruction = getInitUserInstruction({
        name: name,
        owner: { address: userAddress } as any,
        userAccount: userAccount,
        userVault: userVault,
      });

      // 4. Sign and Send
      // Note: signAndSend expects the instruction and the signer
      return await signAndSend(instruction, txSigner)
    },
    onSuccess: (signature) => {
      console.log("Transaction sent: " + signature);
      // You can add a toastTx helper here if you have one, or just standard toast
      toast.success("Transaction sent: " + signature.slice(0, 8) + "...");
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to initialize profile');
    },
  })
}
