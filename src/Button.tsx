import { forwardRef } from "react";

type HTMLButtonProps = JSX.IntrinsicElements["button"];
type ButtonProps = HTMLButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ ...props }, ref) {
    return (
      <button
        ref={ref}
        {...props}
        className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 inline-flex w-full justify-center rounded-md border border-transparent p-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm disabled:opacity-50"
      >
        {props.children}
      </button>
    );
  }
);
