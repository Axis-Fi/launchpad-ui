import { Button, Text, Dialog } from "@/components";

export function LinkWallet() {
  return (
    <Dialog
      open={false}
      title="Link another wallet"
      triggerElement={
        <div className="flex flex-col items-center gap-y-4">
          <Text>
            The wallet your using isn&apos;t connected to your account
          </Text>

          <Button variant="primary">Link wallet</Button>
        </div>
      }
      submitText="Link"
    >
      <>Link 0x0 to your account to claim your points.</>
    </Dialog>
  );
}
