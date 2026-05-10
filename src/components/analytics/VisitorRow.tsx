"use client";

import Link from "next/link";
import { useState } from "react";
import type { AnalyticsVisitorSummary } from "@/lib/analytics/types";
import { formatDate, formatDuration, truncate } from "@/lib/analytics/format";
import { useLocalStorageItem } from "@/hooks/useLocalStorageItem";

interface Props {
  visitor: AnalyticsVisitorSummary;
}

function ipDisplay(visitor: AnalyticsVisitorSummary) {
  if (visitor.ip) return visitor.ip;
  if (visitor.ipHash) return `#${visitor.ipHash.slice(0, 12)}`;
  return "—";
}

export function VisitorRow({ visitor }: Props) {
  const [open, setOpen] = useState(false);
  const selfId = useLocalStorageItem("portfolio_analytics_visitor_id");
  const isSelf = !!selfId && selfId === visitor.visitorId;
  const subtitleParts = [
    visitor.org || (visitor.suspectOrg ? "可疑公司网络" : "普通网络"),
    visitor.device,
  ].filter(Boolean);
  const cityLine = [visitor.country, visitor.region, visitor.city].filter(Boolean).join(" · ") || "未知地区";

  return (
    <article className={`analytics-admin__visitor${open ? " analytics-admin__visitor--open" : ""}`}>
      <header className="analytics-admin__visitor-head">
        <button
          type="button"
          className="analytics-admin__visitor-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className="analytics-admin__visitor-toggle-icon" aria-hidden>
            {open ? "−" : "+"}
          </span>
          <span className="analytics-admin__visitor-info">
            <strong>{visitor.city || "未知城市"}</strong>
            <span className="analytics-admin__visitor-meta">{subtitleParts.join(" · ")}</span>
            <span className="analytics-admin__visitor-meta">{cityLine}</span>
          </span>
        </button>
        <div className="analytics-admin__visitor-tags">
          {isSelf && <span className="analytics-admin__tag analytics-admin__tag--self">我</span>}
          <span className="analytics-admin__tag">{formatDuration(visitor.durationMs)}</span>
          <span className="analytics-admin__tag">{visitor.interest}</span>
          <span className="analytics-admin__tag">PV {visitor.pageViews}</span>
          <span className="analytics-admin__tag analytics-admin__tag--ghost">{ipDisplay(visitor)}</span>
          <span className="analytics-admin__tag analytics-admin__tag--ghost">{formatDate(visitor.lastSeen)}</span>
          <Link
            href={`/admin/analytics/visitor/${encodeURIComponent(visitor.visitorId)}`}
            className="analytics-admin__tag analytics-admin__tag--link"
          >
            访客详情 →
          </Link>
        </div>
      </header>
      {open && (
        <div className="analytics-admin__visitor-body">
          <dl className="analytics-admin__visitor-stats">
            <div>
              <dt>会话开始</dt>
              <dd>{formatDate(visitor.startedAt)}</dd>
            </div>
            <div>
              <dt>最近活动</dt>
              <dd>{formatDate(visitor.lastSeen)}</dd>
            </div>
            <div>
              <dt>滚动深度</dt>
              <dd>{visitor.maxScrollDepth || 0}%</dd>
            </div>
            <div>
              <dt>点击</dt>
              <dd>{visitor.clicks}</dd>
            </div>
            <div>
              <dt>访客 ID</dt>
              <dd>
                <code>{truncate(visitor.visitorId, 22)}</code>
              </dd>
            </div>
            <div>
              <dt>会话 ID</dt>
              <dd>
                <code>{truncate(visitor.sessionId, 22)}</code>
              </dd>
            </div>
            {visitor.referrer && (
              <div>
                <dt>来源</dt>
                <dd>{truncate(visitor.referrer, 60)}</dd>
              </div>
            )}
          </dl>
          {visitor.pagesVisited.length > 0 && (
            <ul className="analytics-admin__visitor-paths">
              {visitor.pagesVisited.map((page) => (
                <li key={page.path}>
                  <span>{page.path}</span>
                  <span>
                    {formatDuration(page.durationMs)} · {page.views} 次
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
