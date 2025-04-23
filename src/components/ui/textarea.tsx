import { TextareaHTMLAttributes } from "react";
import { IoCopy } from "react-icons/io5";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  showCopyButton?: boolean;
}

export function Textarea({
  className,
  showCopyButton = false,
  ...props
}: TextareaProps) {
  const handleCopy = () => {
    if (props.value) {
      navigator.clipboard.writeText(props.value.toString());
    }
  };

  return (
    <div className="relative w-full">
      <textarea
        className={`${className} bg-accent/5 border border-accent/20 outline-0 rounded-2xl px-4 py-3 transition-colors w-full placeholder:text-gray-001/30 pr-10 min-h-[200px] resize-none text-sm`}
        {...props}
      />
      <div className="absolute right-3 top-4 focus:outline-none flex gap-x-2">
        {showCopyButton && (
          <button
            onClick={handleCopy}
            className="text-gray-001/50 hover:text-gray-001/70"
          >
            <IoCopy />
          </button>
        )}
      </div>
    </div>
  );
}
