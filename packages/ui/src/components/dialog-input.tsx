import React from "react";
import { Dialog, DialogProps, LabelWrapper, SelectData } from "./";
import { IconedLabel } from "./iconed-label";

type DialogInputProps = DialogProps & {
  label: string;
  options?: SelectData[];
};

export function DialogInput({ label, options, ...props }: DialogInputProps) {
  const [selected, setSelected] = React.useState<React.ReactNode>();

  const children = React.isValidElement(props.children)
    ? React.cloneElement(props.children, {
        onValueChange: (value: React.ReactNode) => setSelected(value),
        options,
      })
    : props.children;

  const current = options?.find((o) => o.value.toString() === selected);

  const triggerContent = current ? (
    <IconedLabel src={current.imgURL}>{current.label}</IconedLabel>
  ) : (
    props.triggerContent
  );

  return (
    <LabelWrapper content={label}>
      <Dialog
        {...props}
        triggerContent={triggerContent}
        onValueChange={(value) => setSelected(value)}
      >
        {children}
      </Dialog>
    </LabelWrapper>
  );
}
