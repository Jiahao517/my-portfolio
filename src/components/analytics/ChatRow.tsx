"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AnalyticsChatRecord } from "@/lib/analytics/types";
import { formatDate, formatDuration, truncate } from "@/lib/analytics/format";

interface Props {
  record: AnalyticsChatRecord;
  showVisitorLink?: boolean;
}

export function ChatRow({ record, showVisitorLink = true }: Props) {
  const [open, setOpen] = useState(false);
  const [isSelf, setIsSelf] = useState(false);

  useEffect(() => {
    try {
      const selfId = window.localStorage.getItem("portfolio_analytics_visitor_id");
      setIsSelf(!!selfId && selfId === record.visitorId);
    } catch {
      // ignore
    }
  }, [record.visitorId]);
  const ipLabel = record.visitor.ip || (record.visitor.ipHash ? `#${record.visitor.ipHash.slice(0, 12)}` : "—");
  const cityLabel = record.visitor.city || record.visitor.country || "未知地区";
  return (
    <article className={`analytics-admin__chat${open ? " analytics-admin__chat--open" : ""}`}>
      <button
        type="button"
        className="analytics-admin__chat-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="analytics-admin__chat-meta">
          {isSelf && <span className="analytics-admin__tag analytics-admin__tag--self" style={{ display: "inline-block", marginBottom: 4 }}>我</span>}
          <span className="analytics-admin__chat-time">{formatDate(record.timestamp)}</span>
          <span className="analytics-admin__chat-loc">
            {cityLabel} · {ipLabel}
          </span>
          <span className="analytics-admin__chat-loc">
            模型 {record.model} · {formatDuration(record.durationMs)}
          </span>
        </span>
        <span className="analytics-admin__chat-preview">
          <strong>问：</strong>
          {truncate(record.userMessage || "（空）", 80)}
        </span>
        <span className="analytics-admin__chat-preview analytics-admin__chat-preview--reply">
          <strong>答：</strong>
          {truncate(record.assistantMessage || (record.error ? `（错误：${record.error}）` : "（空）"), 80)}
        </span>
      </button>
      {open && (
        <div className="analytics-admin__chat-body">
          <div className="analytics-admin__chat-block">
            <h4>用户问题</h4>
            <p>{record.userMessage || "（空）"}</p>
          </div>
          <div className="analytics-admin__chat-block">
            <h4>AI 回答</h4>
            <p>{record.assistantMessage || (record.error ? `（错误：${record.error}）` : "（空）")}</p>
          </div>
          <div className="analytics-admin__chat-footer">
            {showVisitorLink && (
              <Link
                className="analytics-admin__tag analytics-admin__tag--link"
                href={`/admin/analytics/visitor/${encodeURIComponent(record.visitorId)}`}
              >
                查看该访客全部活动 →
              </Link>
            )}
            <span className="analytics-admin__tag analytics-admin__tag--ghost">
              访客 ID <code>{truncate(record.visitorId, 22)}</code>
            </span>
            <span className="analytics-admin__tag analytics-admin__tag--ghost">
              会话 ID <code>{truncate(record.sessionId, 22)}</code>
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
