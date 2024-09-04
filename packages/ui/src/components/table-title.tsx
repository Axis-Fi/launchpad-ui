import * as React from "react";
import { Text } from "./primitives";

import { cn } from "@/utils";

type TableTitleProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  titleRightElement?: React.ReactNode;
  className?: string;
};

const TableTitle = ({
  className,
  title,
  subtitle,
  titleRightElement,
}: TableTitleProps) => {
  if (!title) return null;
  return (
    <div className={cn("mb-6 flex items-center justify-between", className)}>
      <div className="flex h-[64px] flex-col justify-end">
        <Text size="xl" weight="light">
          {title}
        </Text>
        <Text size="md">{subtitle}</Text>
      </div>
      {titleRightElement && (
        <div className="flex items-center space-x-2">{titleRightElement}</div>
      )}
    </div>
  );
};

TableTitle.displayName = "TableTitle";

export { TableTitle };
