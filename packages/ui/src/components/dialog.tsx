import React from "react";
import { Button } from "./";
import {
  DialogRoot,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./primitives/dialog";

export type DialogProps = React.PropsWithChildren & {
  triggerContent: React.ReactNode;
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
  onSubmit?: (value: unknown) => void;
  onValueChange?: (value: unknown) => void;
  children?: React.ReactElement<{ onValueChange?: () => void }>;
};

export function Dialog(props: DialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<React.ReactNode>();

  const children = React.isValidElement(props.children)
    ? React.cloneElement(props.children, {
        onValueChange: (value: React.ReactNode) => setSelected(value),
      })
    : props.children;

  const triggerContent = selected ?? props.triggerContent;

  const handleSubmit = () => {
    props.onSubmit?.(selected);
    setOpen(false);
  };

  return (
    <DialogRoot open={open} onOpenChange={() => setOpen((prev) => !prev)}>
      <DialogTrigger className="w-full max-w-sm" asChild>
        <Button
          className="text-muted-foreground justify-start"
          variant="outline"
        >
          {triggerContent}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="flex gap-x-1 md:justify-around">
          {props.cancelText && (
            <Button className="w-1/2" variant="destructive" type="reset">
              {props.cancelText}
            </Button>
          )}

          <Button
            className="w-1/2"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            type="submit"
          >
            {props.submitText ?? "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
