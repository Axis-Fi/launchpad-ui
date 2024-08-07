import { Text, cn } from "@repo/ui";

type PageContainerProps = {
  title?: React.ReactNode;
  containerClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function PageContainer(props: PageContainerProps) {
  return (
    <div className="max-w-limit mx-auto pb-20 pt-2 lg:pb-0 lg:pt-6">
      {props.title && (
        <Text size="lg" className="mb-8 ml-2 lg:ml-0">
          {props.title}{" "}
        </Text>
      )}
      <div
        className={cn(
          "mx-auto flex flex-col gap-y-4",
          props.containerClassName,
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
