type PageContainerProps = {
  title?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function PageContainer(props: PageContainerProps) {
  return (
    <div className="mx-auto max-w-[1440px] pt-6">
      {props.title && <h1 className="mb-8">{props.title} </h1>}
      <div className="flex flex-col gap-y-4">{props.children}</div>
    </div>
  );
}
