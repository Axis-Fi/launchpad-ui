import * as React from "react";
import { format, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/utils";
import { Button, CalendarProps, Input } from "./primitives";
import { Calendar } from "./primitives";
import { Popover, PopoverContent, PopoverTrigger } from "./primitives";
import { useTimeInput } from "..";
import { addTimeToDate, formatDate } from "@/helpers";

export type DatePickerProps = {
  content?: string;
  placeholderDate?: Date;
  error?: string;
  time?: boolean;
  onChange?: (date?: Date) => void;
  onBlur?: () => void;
} & CalendarProps;

export function DatePicker({
  content,
  placeholderDate,
  ...props
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();
  const { matcher, time, setTime } = useTimeInput();

  React.useEffect(() => {
    if (!props.time) return;

    //Update date with time once its typed
    if (matcher.test(time) && date) {
      const fullDate = addTimeToDate(date, time);
      /* eslint-disable-next-line */
      const invalid = isBefore(fullDate, new Date()); // TODO: display error if date is invalid
      setDate(fullDate);
      props.onChange?.(fullDate);
    }
  }, [props.time, time, date]);

  return (
    <Popover onOpenChange={(open) => !open && props.onBlur?.()}>
      <PopoverTrigger asChild>
        <Button
          variant="input"
          className={cn(
            "w-full max-w-sm justify-start text-left font-normal",
            !date && "text-foreground/50",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate.fullLocal(date) : <span>{content}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col items-center p-0">
        <Calendar
          mode="single"
          selected={date}
          //@ts-expect-error TODO: fix type mismatch
          onSelect={(date) => {
            props.onChange?.(date);
            setDate(date);
          }}
          initialFocus
          placeholderDate={!placeholderDate ? new Date() : placeholderDate}
          fromDate={new Date()}
          {...props}
        />
        {props.time && (
          <Input
            className="pb-4 text-center text-2xl"
            variant="lg"
            placeholder={
              !placeholderDate ? "00:00" : format(placeholderDate, "HH:mm")
            }
            // TODO does not set the time
            value={time}
            onChange={setTime}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
