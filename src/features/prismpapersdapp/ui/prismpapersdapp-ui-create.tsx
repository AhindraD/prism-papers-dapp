import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { useInitUserMutation } from '../data-access/instructions/use-init-user-mutation'

export function PrismpapersdappUiCreate({ account }: { account: UiWalletAccount }) {
  const greetMutation = useInitUserMutation({ account })

  return (
    <Button
    // onClick={() => greetMutation.mutateAsync()} 
    // disabled={greetMutation.isPending}
    >
      Run program{ }
    </Button>
  )
}
