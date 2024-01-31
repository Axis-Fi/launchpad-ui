import React, { useCallback } from "react";
import { Dialog, DialogProps, LabelWrapper, SelectData } from "./";
import { IconedLabel } from "./iconed-label";

export type DialogInputProps = DialogProps & {
  label: string;
  onSubmit?: (value: unknown) => void;
  children?: React.ReactElement<{
    onValueChange?: (value: unknown, display?: SelectData) => void;
  }>;
};

export function DialogInput({ label, ...props }: DialogInputProps) {
  const [selected, setSelected] = React.useState<unknown>();
  const [display, setDisplay] = React.useState<SelectData>();

  const onValueChange = useCallback((value: unknown, display?: SelectData) => {
    setSelected(value);
    setDisplay(display);
  }, []);

  const children = React.isValidElement(props.children)
    ? React.cloneElement(props.children, {
        onValueChange,
      })
    : props.children;

  const triggerContent = display ? (
    <IconedLabel src={display.imgURL} label={display.label} />
  ) : (
    props.triggerContent
  );

  return (
    <LabelWrapper content={label}>
      <Dialog
        {...props}
        triggerContent={triggerContent}
        onSubmit={() => props.onSubmit?.(selected)}
      >
        {children}
      </Dialog>
    </LabelWrapper>
  );
}
