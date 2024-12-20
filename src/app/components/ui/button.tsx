"use client";

import { CSSProperties, ReactNode } from "react";

type ButtonProps = {
  onClick: () => void;
  style?: CSSProperties;
  children: ReactNode;
};

const Button = (props: ButtonProps) => {
  const { onClick, style, children } = props;
  return (
    <button
      className="bg-blue rounded-lg  text-lg text-offWhite w-full p-4 relative flex items-center justify-center gap-2"
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
