import { Button, cn } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PageHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  backNavigationPath?: string;
  backNavigationText?: string;
};

export function PageHeader({
  className,
  backNavigationPath,
  backNavigationText = "Back to Launches",
  children,
}: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div
      className={cn("max-w-limit mt-2 flex justify-between lg:mt-5", className)}
    >
      <Button
        className="w-fit"
        size="icon"
        variant="ghost"
        //@ts-expect-error interesting TS quirk below,
        //both string and number are valid but on different signatures
        onClick={() => navigate(backNavigationPath ?? -1)}
      >
        <div className="flex ">
          <ArrowLeft className="" />
          {backNavigationText}
        </div>
      </Button>
      {children}
    </div>
  );
}
