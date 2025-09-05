import React from "react";
import { twMerge } from "tailwind-merge";

export default function FormSeparator({
  title,
  ...props
}: { title: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        "flex-row-reverse items-center gap-2 flex",
        props.className
      )}
    >
      <div className="h-[2px] flex-1 bg-primary-500"></div>
      <h2 className="font-bold text-primary-500 self-end text-lg">{title}</h2>
    </div>
  );
}
