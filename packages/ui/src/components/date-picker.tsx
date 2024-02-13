import * as React from "react";
import { addDays, format, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/utils";
import { Button, CalendarProps, Input } from "./primitives";
import { Calendar } from "./primitives";
import { Popover, PopoverContent, PopoverTrigger } from "./primitives";
import { useTimeInput } from "..";
import { addTimeToDate } from "../date-math";

export type DatePickerProps = {
  content?: string;
  error?: string;
  time?: boolean;
  onChange?: (date?: Date) => void;
  onBlur?: () => void;
} & CalendarProps;

export function DatePicker({ content, ...props }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();
  const { matcher, time, setTime } = useTimeInput();

  React.useEffect(() => {
    if (!props.time) return;

    //Update date with time once its typed
    if (matcher.test(time) && date) {
      const fullDate = addTimeToDate(date, time);
      /* eslint-disable-next-line */
      const invalid = isBefore(fullDate, new Date()); //TODO: see if validation can be done by zod
      setDate(fullDate);
      props.onChange?.(fullDate);
    }
  }, [props.time, time]);

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
          {date ? format(date, "PPP") : <span>{content}</span>}
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
          fromDate={addDays(new Date(), 1)}
          {...props}
        />
        {props.time && (
          <Input
            className="pb-4 text-center text-2xl"
            variant="lg"
            placeholder="00:00"
            value={time}
            onChange={setTime}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
