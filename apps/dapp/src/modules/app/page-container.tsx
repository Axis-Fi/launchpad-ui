type PageContainerProps = {
  title?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function PageContainer(props: PageContainerProps) {
  return (
    <div className="mt-5">
      {props.title && <h1 className="mb-8">{props.title} </h1>}
      {props.children}
    </div>
  );
}
