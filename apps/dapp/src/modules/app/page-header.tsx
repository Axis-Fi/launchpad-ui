import { Button } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PageHeader() {
  const navigate = useNavigate();
  return (
    <div className="mt-5">
      <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </Button>
    </div>
  );
}
