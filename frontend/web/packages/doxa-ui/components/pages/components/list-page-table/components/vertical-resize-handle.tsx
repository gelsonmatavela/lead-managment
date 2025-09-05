import { useState, useEffect, useRef, useCallback } from "react";
import { twMerge } from "tailwind-merge";

export default function VerticalResizeHandle({
  onResize,
  className,
}: {
  onResize: (deltaY: number) => void;
  className?: string;
}) {
  const [isResizing, setIsResizing] = useState(false);
  const startY = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startY.current = e.clientY;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaY = e.clientY - startY.current;
      onResize(deltaY);
      startY.current = e.clientY;
    },
    [isResizing, onResize]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "row-resize";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={twMerge(
        "absolute bottom-0 left-0 right-0 h-1 cursor-row-resize opacity-0 hover:opacity-100 bg-blue-500 hover:bg-blue-600 transition-opacity",
        isResizing && "opacity-100",
        className
      )}
      onMouseDown={handleMouseDown}
    />
  );
}
