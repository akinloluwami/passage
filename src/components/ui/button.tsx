import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`${props.className} bg-accent text-white rounded-2xl px-4 py-3 cursor-pointer hover:bg-accent/80 transition-colors`}
    >
      {children}
    </button>
  );
}
