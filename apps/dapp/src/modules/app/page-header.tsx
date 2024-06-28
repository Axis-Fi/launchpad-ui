import { Button, cn } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PageHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  backNavigationPath?: string;
  backNavigationText?: string;
};

export function PageHeader(props: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div
      className={cn("max-w-limit mt-5 flex justify-between", props.className)}
    >
      <Button
        className="w-fit"
        size="icon"
        variant="ghost"
        //@ts-expect-error interesting TS quirk below,
        //both string and number are valid but on different signatures
        onClick={() => navigate(props.backNavigationPath ?? -1)}
      >
        <div className="flex ">
          <ArrowLeft className="" />
          Back to Launches
        </div>
      </Button>
      {props.children}
    </div>
  );
}
