import React from "react";

import {
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./primitives";
import { Avatar } from "./primitives/avatar";
import { cn } from "..";

export type SelectData = {
  value: string;
  label: string;
  imgURL?: string;
};

export type SelectProps = {
  options: SelectData[];
  id?: string;
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  triggerClassName?: string;
};

/** Dropdown selector */
export function Select(props: SelectProps) {
  const [selected, setSelected] = React.useState<unknown>();
  const selectedImage = props.options.find((o) => o.value === selected)?.imgURL;

  return (
    <SelectRoot
      defaultValue={props.defaultValue}
      onValueChange={(value) => {
        setSelected(value);
        props.onChange?.(value);
      }}
    >
      <SelectTrigger
        id={props.id}
        className={cn(
          "bg-muted border-muted w-full max-w-sm rounded-full",
          props.triggerClassName,
        )}
      >
        <div className="flex items-center justify-start gap-x-1">
          {selectedImage && <Avatar src={selectedImage} />}
          <SelectValue placeholder={props.placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {props.options?.map(({ label, value }) => (
          <SelectItem
            key={label}
            value={value}
            onClick={() => {
              setSelected(value);
              props.onChange?.(value);
            }}
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
