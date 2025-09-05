export function isDateColumn(value: string) {
  if (typeof value !== "string") return false;
  const valueParts = value.split("__");
  if (valueParts.length < 2) return false;

  if (valueParts[1] === "date") return true;
  return false;
}

export function getTextWithoutColumnModifier(value: string) {
  if (typeof value !== "string") return value;
  const valueParts = value.split("__");
  if (valueParts.length < 2) return value;
  return valueParts[0];
}
