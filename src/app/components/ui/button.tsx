"use client";

import { CSSProperties, ReactNode } from "react";

type ButtonProps = {
  onClick: () => void;
  style?: CSSProperties;
  children: ReactNode;
  disabled?: boolean;
};

const Button = (props: ButtonProps) => {
  const { onClick, style, children, disabled } = props;
  return (
    <button
      className="bg-blue rounded-lg  text-lg text-offWhite w-full p-4 relative flex items-center justify-center gap-2"
      style={style}
      onClick={onClick}
      disabled={disabled ?? false}
    >
      {children}
    </button>
  );
};

export default Button;
