export default function escapeString(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
