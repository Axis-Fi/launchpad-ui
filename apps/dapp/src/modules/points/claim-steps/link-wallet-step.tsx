import { Link } from "react-router-dom";
import { Button, Card } from "@repo/ui";
import { LinkWalletForm } from "../link-wallet-form";

export function LinkWalletStep() {
  return (
    <Card className="bg-surface w-full">
      <LinkWalletForm
        footer={
          <Button asChild variant="secondary">
            <Link to="/points">View Profile</Link>
          </Button>
        }
      />
    </Card>
  );
}
