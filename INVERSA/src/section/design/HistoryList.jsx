import React from "react";
import HistoryProjectItem from "../../components/HistoryProjectItem";

export default function HistoryList({
  historyItems = [],
}) {

  if (historyItems.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Your reading history will appear here
      </p>
    );
  }

  return (
    <div
      className="
      max-h-[260px]
      space-y-3
      overflow-y-auto
      pr-1
      "
    >
      {historyItems.map((item) => (
        <HistoryProjectItem
          key={item.id}
          project={item.project}
        />
      ))}
    </div>
  );
}

