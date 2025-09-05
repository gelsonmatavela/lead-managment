export function getNestedErrorMessage(
  errors: Record<string, any>,
  path: string
) {
  // Split the path into parts (e.g., "profile.nickname" -> ["profile", "nickname"])
  const parts = path.split(".");

  // Navigate through the nested errors
  let current = errors;
  for (const part of parts) {
    if (!current || !current[part]) return null;
    current = current[part];
  }

  // Return the message if found
  return current.message ? current.message : null;
}
