import { Button, Dialog } from "@/components";
import { usePoints } from "context/points-provider";

export function SignIn() {
  const { signIn } = usePoints();

  return (
    <Dialog
      open={false}
      title="Sign in"
      triggerElement={<Button variant="primary">Sign in to continue</Button>}
      submitText="Sign in"
      onSubmit={signIn}
    >
      <>Sign in to continue.</>
    </Dialog>
  );
}
