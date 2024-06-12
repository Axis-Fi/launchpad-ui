import { Button, Text, cn } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PageHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  backNavigationPath?: string;
  backNavigationText?: string;
};

export function PageHeader(props: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className={cn("mt-5 flex justify-between", props.className)}>
      <Button
        size="icon"
        variant="ghost"
        //@ts-expect-error interesting TS quirk below,
        //both string and number are valid but on different signatures
        onClick={() => navigate(props.backNavigationPath ?? -1)}
      >
        <div className="flex justify-between">
          <div className="w-8">
            <ArrowLeft className="w-8" />
          </div>
          <Text className="inline"> {props.backNavigationText}</Text>
        </div>
      </Button>
      {props.children}
    </div>
  );
}
