"use client";

import { useLocalStorageItem } from "@/hooks/useLocalStorageItem";

export function SelfBadge({ visitorId }: { visitorId: string }) {
  const selfId = useLocalStorageItem("portfolio_analytics_visitor_id");
  const isSelf = !!selfId && selfId === visitorId;

  if (!isSelf) return null;
  return (
    <span className="analytics-admin__tag analytics-admin__tag--self" style={{ fontSize: 14, padding: "4px 14px" }}>
      这是你自己
    </span>
  );
}
