import React from "react";
import { FiLoader } from "react-icons/fi";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  isLoading = false,
  className = "",
  type = "button",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-light-accent dark:bg-dark-accent text-white hover:opacity-90",

    secondary:
      "bg-transparent border-2 border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white",

    outline:
      "bg-transparent border border-light-border dark:border-dark-border text-light-primary dark:text-dark-primary hover:bg-light-surface dark:hover:bg-dark-surface",

    ghost:
      "bg-transparent text-light-primary dark:text-dark-primary hover:bg-light-surface dark:hover:bg-dark-surface",

    danger:
      "bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-lg",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <FiLoader className="animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

export default Button;
