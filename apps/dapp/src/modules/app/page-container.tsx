type PageContainerProps = {
  title?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function PageContainer(props: PageContainerProps) {
  return (
    <div className="mx-auto max-w-[1340px] pt-5">
      {props.title && <h1 className="mb-8">{props.title} </h1>}
      {props.children}
    </div>
  );
}
