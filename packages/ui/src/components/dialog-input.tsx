import React, { useCallback } from "react";
import {
  Button,
  Dialog,
  DialogProps,
  InputError,
  LabelWrapper,
  SelectData,
} from "./";
import { IconedLabel } from "./iconed-label";

export type DialogInputProps<T> = Omit<DialogProps, "onSubmit"> & {
  label: string;
  onSubmit?: (value?: T) => void;
  error?: string;
  children?: React.ReactElement<{
    onValueChange?: (value: T, display?: SelectData) => void;
  }>;
};

export function DialogInput<T>({ label, ...props }: DialogInputProps<T>) {
  const [selected, setSelected] = React.useState<T>();
  const [display, setDisplay] = React.useState<SelectData>();

  const onValueChange = useCallback((value: T, display?: SelectData) => {
    setSelected(value);
    setDisplay(display);
  }, []);

  const children = React.isValidElement(props.children)
    ? React.cloneElement(props.children, { onValueChange })
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
        triggerElement={
          <Button variant="outline" className="flex w-full justify-start">
            {triggerContent}
          </Button>
        }
        onSubmit={() => props.onSubmit?.(selected)}
      >
        {children}
      </Dialog>
      <InputError error={props.error} />
    </LabelWrapper>
  );
}
