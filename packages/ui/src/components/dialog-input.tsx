import React, { useCallback } from "react";
import { Button, Dialog, DialogProps, SelectData } from "./";
import { IconedLabel } from "./iconed-label";

export type DialogInputProps<T> = Omit<DialogProps, "onSubmit"> & {
  onSubmit?: (value?: T) => void;
  onChange?: (value?: T) => void;
  onBlur?: () => void;
  error?: string;
  children?: React.ReactElement<{
    onChange?: (value: T, display?: SelectData) => void;
  }>;
};

export function DialogInput<T>({ onChange, ...props }: DialogInputProps<T>) {
  const [selected, setSelected] = React.useState<T>();
  const [display, setDisplay] = React.useState<SelectData>();

  const handleChange = useCallback(
    (value: T, display?: SelectData) => {
      setSelected(value);
      setDisplay(display);

      onChange?.(value);
    },
    [onChange],
  );

  const children = React.isValidElement(props.children)
    ? React.cloneElement(props.children, { onChange: handleChange })
    : props.children;

  const triggerContent = display ? (
    <IconedLabel src={display.imgURL} label={display.label} />
  ) : (
    props.triggerContent
  );

  return (
    <Dialog
      {...props}
      onOpenChange={(open) => !open && props.onBlur?.()}
      triggerElement={
        <Button
          variant="input"
          className="text-foreground/50 flex w-full justify-start"
        >
          {triggerContent}
        </Button>
      }
      onSubmit={() => props.onSubmit?.(selected)}
    >
      {children}
    </Dialog>
  );
}
