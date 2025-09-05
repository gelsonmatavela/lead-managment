import { useEffect, useState } from "react";

export default function BetweenFilterInput({
  value,
  onChange,
  type,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  type: string | undefined;
  disabled: boolean;
}) {
  const [localMin, setLocalMin] = useState("");
  const [localMax, setLocalMax] = useState("");

  useEffect(() => {
    if (value) {
      const [min, max] = value.split(",");
      setLocalMin(min || "");
      setLocalMax(max || "");
    }
  }, [value]);

  const handleMinChange = (newMin: string) => {
    setLocalMin(newMin);
    if (newMin || localMax) {
      onChange(`${newMin},${localMax}`);
    }
  };

  const handleMaxChange = (newMax: string) => {
    setLocalMax(newMax);
    if (localMin || newMax) {
      onChange(`${localMin},${newMax}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        disabled={disabled}
        type={type}
        className="border rounded px-2 py-1 w-24"
        value={localMin}
        onChange={(e) => handleMinChange(e.target.value)}
        placeholder="Min"
      />
      <span>e</span>
      <input
        disabled={disabled}
        type={type}
        className="border rounded px-2 py-1 w-24"
        value={localMax}
        onChange={(e) => handleMaxChange(e.target.value)}
        placeholder="Max"
      />
    </div>
  );
}
