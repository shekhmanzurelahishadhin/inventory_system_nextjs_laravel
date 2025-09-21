// utils/dateFormat.ts
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  // Formatted date
  const formattedDate = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Human diff
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let humanDiff = "";
  if (diffSeconds < 60) humanDiff = `${diffSeconds}s ago`;
  else if (diffMinutes < 60) humanDiff = `${diffMinutes}m ago`;
  else if (diffHours < 24) humanDiff = `${diffHours}h ago`;
  else humanDiff = `${diffDays}d ago`;

  return `${formattedDate} (${humanDiff})`;
};
