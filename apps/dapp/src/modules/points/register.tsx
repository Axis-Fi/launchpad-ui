import { Button, Dialog } from "@/components";

export function Register() {
  return (
    <Dialog
      open={false}
      title="Claim your points"
      triggerElement={<Button variant="primary">Claim your points</Button>}
      submitText="Claim"
    >
      <>
        Claim your points lorem ipsum dolor sit amet, consectetur adipiscing
        elit.
      </>
    </Dialog>
  );
}
