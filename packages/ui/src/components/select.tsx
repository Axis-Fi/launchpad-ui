import React from "react";

import {
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  LabelWrapper,
} from "./primitives";
import { Avatar } from "./primitives/avatar";

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
};

/** Dropdown selector */
export function Select(props: SelectProps) {
  const [selected, setSelected] = React.useState<unknown>();
  const selectedImage = props.options.find((o) => o.value === selected)?.imgURL;

  return (
    <LabelWrapper htmlFor={props.id} content={props.label}>
      <SelectRoot
        onValueChange={(value) => {
          setSelected(value);
          props.onChange?.(value);
        }}
      >
        <SelectTrigger id={props.id} className="w-full max-w-sm">
          <div className="flex justify-start gap-x-1">
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
    </LabelWrapper>
  );
}
