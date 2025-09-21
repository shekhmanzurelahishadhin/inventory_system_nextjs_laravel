// utils/dateFormat.tsx
import React from "react";

interface DateBadgeProps {
  dateString: string;
}

export const DateFomant: React.FC<DateBadgeProps> = ({ dateString }) => {
  if (!dateString) return <span className="text-xs text-gray-400">-</span>;

  const date = new Date(dateString);

  // Formatted date (small)
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

  return (
    <div className="flex flex-col text-xs">
      <span className="text-gray-700 font-medium">{formattedDate}</span>
      <span className="text-gray-400">{humanDiff}</span>
    </div>
  );
};
