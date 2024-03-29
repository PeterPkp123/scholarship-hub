import * as React from "react";
import { cn } from "~/utils/cn";
import { Label } from "../label";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  textarea?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, textarea = false, ...props }, ref) => {
    if (textarea) {
      return (
        <textarea
          className={cn(
            "flex h-48 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
            className
          )}
          ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }

    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const InputWithText: React.FC<{
  label: React.ReactNode;
  inputProps: InputProps;
  error?: string;
}> = ({ label, inputProps, error }) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor={inputProps.id}>{label}</Label>
      <Input {...inputProps} />
      <p className="!mt-0 text-sm text-red-500">{error}</p>
    </div>
  );
};

export { Input, InputWithText };
