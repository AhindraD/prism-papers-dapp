import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getInitUserInstruction, PRISMPAPERSDAPP_PROGRAM_ADDRESS } from '@project/anchor'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { address, getAddressEncoder, getProgramDerivedAddress } from 'gill'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { toastTx } from '@/components/toast-tx'

export const USER_SEED = new TextEncoder().encode("user");
const VAULT_USER_SEED = new TextEncoder().encode("vault_user");

export function useInitUserMutation({ account }: { account: UiWalletAccount }) {
  // 1. Hooks are called here (Top level of this custom hook)
  // console.log(account)
  const txSigner = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  // return useMutation({
  //   mutationFn: async () => {
  //     return await signAndSend(getGreetInstruction({ programAddress: PRISMPAPERSDAPP_PROGRAM_ADDRESS }), txSigner)
  //   },
  //   onSuccess: (signature) => {
  //     toastTx(signature)
  //   },
  //   onError: () => toast.error('Failed to run program'),
  // })
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {

      const userAddress = address(account.address.toString());

      // Ensure we use the correct program ID address
      const programAddress = address(PRISMPAPERSDAPP_PROGRAM_ADDRESS);

      // 2. Derive PDAs
      const [userAccount] = await getProgramDerivedAddress({
        programAddress,
        seeds: [USER_SEED, getAddressEncoder().encode(userAddress)],
      });
      const [userVault] = await getProgramDerivedAddress({
        programAddress,
        seeds: [VAULT_USER_SEED, getAddressEncoder().encode(userAddress)],
      });
      // console.log(name)
      // console.log("User Account: ", userAccount.toString());
      // console.log("User Vault: ", userVault.toString());
      // 4. Sign and Send
      const instruction = getInitUserInstruction({
        name: name,
        owner: txSigner,
        userAccount: userAccount,
        userVault: userVault,
      });
      const signature = await signAndSend(instruction, txSigner);
      return signature
    },
    onSuccess: (signature) => {
      console.log("Transaction sent: ", signature);
      // You can add a toastTx helper here if you have one, or just standard toast
      toastTx(signature)
    },
    onError: (error) => {
      console.log(error);
      toast.error('Failed to initialize profile');
    },
  })
}
