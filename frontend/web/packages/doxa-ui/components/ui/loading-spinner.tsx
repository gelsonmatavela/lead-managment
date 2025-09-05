import { LoaderIcon, LucideProps } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function LoadingSpinner({
  className,
  Icon,
  ...props
}: {
  className?: string;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
} & LucideProps) {
  if (!Icon)
    return (
      <LoaderIcon
        {...props}
        strokeWidth={2.5}
        className={twMerge("animate-spin text-primary-500", className)}
      />
    );

  return (
    <Icon
      {...props}
      strokeWidth={2.5}
      className={twMerge(
        " text-primary-500 [animation:spin_0.75s_linear_infinite]",
        className
      )}
    />
  );
}
