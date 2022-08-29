import { ButtonHTMLAttributes, ReactNode } from "react";
import spinSVG from "../assets/images/spin.svg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={isLoading}
      className={`p-2 rounded-md disabled:hover:opacity-50 disabled:opacity-50 hover:opacity-70 transition-colors ${className}`}
      {...rest}
    >
      {isLoading && (
        <img className="animate-spin h-5 w-24" src={spinSVG} alt="loading" />
      )}
      {!isLoading && children}
    </button>
  );
}
