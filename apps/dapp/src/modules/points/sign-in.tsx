import { Button, Dialog } from "@/components";
import { useProfile } from "./hooks/use-profile";

export function SignIn() {
  const { signIn } = useProfile();

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
