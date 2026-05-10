"use client";

import { useEffect, useState } from "react";

export function SelfBadge({ visitorId }: { visitorId: string }) {
  const [isSelf, setIsSelf] = useState(false);

  useEffect(() => {
    try {
      const selfId = window.localStorage.getItem("portfolio_analytics_visitor_id");
      setIsSelf(!!selfId && selfId === visitorId);
    } catch {
      // ignore
    }
  }, [visitorId]);

  if (!isSelf) return null;
  return (
    <span className="analytics-admin__tag analytics-admin__tag--self" style={{ fontSize: 14, padding: "4px 14px" }}>
      这是你自己
    </span>
  );
}
