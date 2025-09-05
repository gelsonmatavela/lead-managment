import React from "react";
import { twMerge } from "tailwind-merge";
import LoadingSpinner from "./loading-spinner";
import { LoaderCircleIcon } from "lucide-react";

export default function PageLoadingSpinner({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex flex-1 items-center justify-center flex-col gap-2 h-full w-full",
        className
      )}
    >
      <div className="card rounded-full p-2 border-zinc-200 border">
        <LoadingSpinner
          strokeWidth={2.5}
          Icon={LoaderCircleIcon}
          className="size-8"
        />
      </div>
      {/* <span>Carregando...</span> */}
    </div>
  );
}
