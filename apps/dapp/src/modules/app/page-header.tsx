import { Button, cn } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PageHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  return (
    <div className={cn("mt-5 flex justify-between", props.className)}>
      <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </Button>
      {props.children}
    </div>
  );
}
