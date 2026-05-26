import { cn } from "../../utils/cn";

export default function Input({
  label,
  id,
  type = "text",
  error,
  leftIcon,
  rightElement,
  className = "",
  containerClassName = "",
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-semibold text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "w-full rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            leftIcon && "pl-10",
            rightElement && "pr-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
