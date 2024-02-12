export function InfoLabel(props: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-40">
      <p className="text-2xl">{props.value}</p>
      <p>{props.label}</p>
    </div>
  );
}
