import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/utils";
import { Button, CalendarProps, LabelWrapper } from "./primitives";
import { Calendar } from "./primitives";
import { Popover, PopoverContent, PopoverTrigger } from "./primitives";

export type DatePickerProps = {
  content?: string;
  label?: string;
  onChange?: (date?: Date) => void;
} & CalendarProps;

export function DatePicker({ content, label, ...props }: DatePickerProps) {
  const [date, setDate] = React.useState();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <LabelWrapper content={label}>
          <Button
            variant={"outline"}
            className={cn(
              "w-full max-w-sm justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{content}</span>}
          </Button>
        </LabelWrapper>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            props.onChange?.(date);
            setDate(date);
          }}
          initialFocus
          fromDate={new Date()}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}
