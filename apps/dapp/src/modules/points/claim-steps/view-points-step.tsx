import { Button, Card } from "@repo/ui";
import { AxisPointsHeader } from "../claim-points-wizard";
import { trimCurrency } from "utils/currency";
import { Link } from "react-router-dom";

export function ViewPointsStep() {
  const points = 42002034;
  return (
    <Card>
      <AxisPointsHeader subtitle={`${trimCurrency(points)} points claimed`} />
      <img src="points-logo.png" className="mx-auto my-8 size-[200px]" />

      <div className="flex flex-col items-center gap-y-2 *:w-full">
        <Button>
          <Link to="/points">View Profile</Link>
        </Button>
        <Button variant="secondary">Link Wallets to combine Points</Button>
      </div>
    </Card>
  );
}
