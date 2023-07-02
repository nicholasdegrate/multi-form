import clsx from "clsx";
import { forwardRef } from "react";

type HTMLInputProps = JSX.IntrinsicElements["input"];
type InputProps = HTMLInputProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      {...props}
      className={clsx(
        "my-4 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring invalid:focus:border-red-400  invalid:focus:ring-red-200 invalid:ring-opacity-50 focus:ring-indigo-200 focus:ring-opacity-50",
        className
      )}
    />
  );
});
