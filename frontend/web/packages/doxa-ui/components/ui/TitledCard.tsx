import React from "react";
import { twMerge } from "tailwind-merge";

export default function TitledCard({
  title,
  children,
  className,
  contentContainerClassName,
  ...props
}: {
  title: string;
  children?: React.ReactNode;
  contentContainerClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={twMerge("border border-zinc-200 rounded-md", className)}
    >
      <div className="border-b border-zinc-200 small-lg:p-4 p-2">
        <h3 className="font-bold md:text-xl text-lg">{title}</h3>
      </div>
      <div
        className={twMerge(
          "small-lg:p-4 p-2 rounded-md rounded-t-none",
          contentContainerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
