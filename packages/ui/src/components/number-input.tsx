import React from "react";
import { Input, InputProps } from "./primitives/input";
export type NumberInputProps = {
  value: string;
  onChange: (value: string) => void;
} & InputProps;

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string>(value);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!, [inputRef]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;

      // Allow only digits and a single decimal point, with dot as first character case
      let validValue = rawValue.replace(/[^\d.]/g, ""); // Allow only digits and one dot

      // If the first character is a ".", prepend it with "0"
      if (validValue.startsWith(".")) {
        validValue = "0" + validValue;
      }

      // Prevent multiple decimal points
      if ((validValue.match(/\./g) || []).length > 1) {
        return; // Stop processing if more than one decimal
      }

      // Remove commas for the raw value before formatting
      const numericValue = validValue.replace(/,/g, "");

      // Update the internal state with the valid raw value
      setInternalValue(validValue);

      // Call the onChange handler with the cleaned number
      onChange(numericValue);

      // Format the number with commas for thousands
      const formattedValue = formatNumber(numericValue);

      // Calculate the new cursor position
      const newCursorPos = calculateNewCursorPos(
        event.target.selectionStart || 0,
        rawValue,
        formattedValue,
      );

      // Update the formatted value in the input field
      setInternalValue(formattedValue);

      // Restore the cursor position after formatting
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    };

    const formattedValue = formatNumber(internalValue);

    return (
      <Input
        ref={inputRef}
        type="text"
        value={formattedValue}
        onChange={handleChange}
        {...props}
      />
    );
  },
);

NumberInput.displayName = "NumberInput";

export default NumberInput;

// Helper function to format the number with commas
function formatNumber(value: string): string {
  const [integerPart, decimalPart] = value.split(".");

  // Format the integer part with commas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Return the formatted number with the decimal part if it exists
  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
}

// Helper function to calculate the new cursor position
function calculateNewCursorPos(
  currentPos: number,
  rawValue: string,
  formattedValue: string,
): number {
  // Get the difference between the formatted and raw value lengths
  const difference = formattedValue.length - rawValue.length;

  // Adjust the cursor position based on where the commas were inserted or removed
  return currentPos + difference;
}
