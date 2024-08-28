import { Input, cn } from "..";

export type InfoLabelProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  valueSize?: "sm" | "md" | "lg";
  reverse?: boolean;
  editable?: boolean;
  className?: string;
  inputClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const valueSizeMap = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-3xl",
} as const;

export function InfoLabel({
  label,
  reverse,
  editable,
  valueSize,
  className,
  inputClassName,
  ...props
}: InfoLabelProps) {
  return (
    <div className={cn(className, reverse && "flex flex-col-reverse")}>
      {editable ? (
        <Input
          variant="ghost"
          textSize="lg"
          className={inputClassName}
          {...props}
        />
      ) : (
        <p className={cn(valueSizeMap[valueSize || "md"], className)}>
          {props.value}
        </p>
      )}
      <p className="text-sm">{label}</p>
    </div>
  );
}
