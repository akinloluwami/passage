import { InputHTMLAttributes, useState } from "react";
import { IoCopy } from "react-icons/io5";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  showCopyButton?: boolean;
  isPassword?: boolean;
}

export function Input({
  className,
  showCopyButton = false,
  isPassword = false,
  type,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Determine the input type based on conditions
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      <input
        className={`${className} text-sm bg-accent/5 border border-accent/20 outline-0 rounded-2xl px-4 py-3 transition-colors w-full placeholder:text-gray-001/30 pr-10`}
        type={inputType}
        {...props}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none flex gap-x-2">
        {isPassword && (
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-001/50 hover:text-gray-001/70 "
          >
            {showPassword ? (
              <AiFillEyeInvisible size={18} />
            ) : (
              <AiFillEye size={18} />
            )}
          </button>
        )}
        {showCopyButton && (
          <button className="text-gray-001/50 hover:text-gray-001/70 ">
            <IoCopy />
          </button>
        )}
      </div>
    </div>
  );
}
