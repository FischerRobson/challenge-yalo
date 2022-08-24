import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      className={`p-2 rounded-md hover:opacity-70 transition-colors ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
