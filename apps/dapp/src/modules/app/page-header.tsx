import { Button, UsdToggle, cn } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PageHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  backNavigationPath?: string;
  backNavigationText?: string;
  toggle?: boolean;
  toggleSymbol?: string;
};

export function PageHeader({
  className,
  backNavigationPath,
  backNavigationText = "Back to Launches",
  children,
  toggle,
  toggleSymbol = "Quote",
}: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        "mt-2 flex w-full items-center justify-between lg:my-5",
        className,
      )}
    >
      <Button
        size="icon"
        className="ml-4 "
        variant="ghost"
        //@ts-expect-error interesting TS quirk below,
        //both string and number are valid but on different signatures
        onClick={() => navigate(backNavigationPath ?? -1)}
      >
        <div className="relative left-20 flex">
          <ArrowLeft className="absolute -left-7" />
          {backNavigationText}
        </div>
      </Button>
      <div className="mx-auto">{children}</div>
      {toggle && <UsdToggle currencySymbol={toggleSymbol} />}
    </div>
  );
}
