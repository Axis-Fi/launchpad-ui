import React, { useCallback } from "react";
import { Button, Dialog, DialogProps, SelectData } from "./";
import { IconedLabel } from "./iconed-label";

export type DialogInputProps<T> = Omit<DialogProps, "onSubmit"> & {
  onSubmit?: (value?: T) => void;
  onChange?: (value?: T) => void;
  onBlur?: () => void;
  error?: string;
  children?: React.ReactElement<{
    onChange?: DialogInputChangeHandler<T>;
  }>;
  display?: {
    imgURL?: string;
    label: string;
    value: string;
  };
  disabled?: boolean;
};

export type DialogInputChangeHandler<T> = (
  value: T,
  display?: SelectData,
) => void;

export function DialogInput<T>({ onChange, ...props }: DialogInputProps<T>) {
  const [selected, setSelected] = React.useState<T>();
  const [display, setDisplay] = React.useState<SelectData | undefined>(
    props.display,
  );

  const handleChange: DialogInputChangeHandler<T> = useCallback(
    (value, display) => {
      setSelected(value);
      setDisplay(display);

      onChange?.(value);
    },
    [onChange],
  );

  const children = React.isValidElement(props.children)
    ? React.cloneElement(props.children, {
        onChange: handleChange,
      })
    : props.children;

  const triggerContent = display ? (
    <IconedLabel src={display.imgURL} label={display.label} />
  ) : (
    props.triggerContent
  );

  return (
    <Dialog
      {...props}
      onOpenChange={(open) => {
        !open && props.onBlur?.();
      }}
      triggerElement={
        <Button variant="input" className="flex w-full justify-start">
          {triggerContent}
        </Button>
      }
      onSubmit={() => {
        props.onSubmit?.(selected);
      }}
      disabled={props.disabled}
    >
      {children}
    </Dialog>
  );
}
