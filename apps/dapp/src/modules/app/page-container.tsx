type PageContainerProps = {
  title?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function PageContainer(props: PageContainerProps) {
  return (
    <div className="max-w-limit mx-auto pb-20 pt-2 lg:pb-0 lg:pt-6">
      {props.title && <h1 className="mb-8">{props.title} </h1>}
      <div className="mx-auto flex flex-col gap-y-4">{props.children}</div>
    </div>
  );
}
