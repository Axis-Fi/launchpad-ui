import { Button, Dialog } from "@/components";

export function SignIn() {
  return (
    <Dialog
      open={false}
      title="Sign in"
      triggerElement={<Button variant="primary">Sign in to continue</Button>}
      submitText="Sign in"
    >
      <>Sign in to continue.</>
    </Dialog>
  );
}
