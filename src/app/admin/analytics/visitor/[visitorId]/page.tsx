import Link from "next/link";
import { notFound } from "next/navigation";
import { readVisitorDetail } from "@/lib/analytics/storage";
import { formatDate, formatDuration, truncate } from "@/lib/analytics/format";
import { ChatRow } from "@/components/analytics/ChatRow";
import { SelfBadge } from "@/components/analytics/SelfBadge";
import type { AnalyticsVisitorTimelineItem } from "@/lib/analytics/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ visitorId: string }>;
}

export default async function VisitorDetailPage({ params }: Props) {
  const { visitorId } = await params;
  const detail = await readVisitorDetail(visitorId);
  if (!detail) notFound();

  return (
    <main className="analytics-admin">
      <header className="analytics-admin__header">
        <div>
          <p className="analytics-admin__eyebrow">
            <Link href="/admin/analytics" className="analytics-admin__back">
              ← 返回分析首页
            </Link>
          </p>
          <h1>
            访客 {truncate(detail.visitorId, 22)}{" "}
            <SelfBadge visitorId={detail.visitorId} />
          </h1>
          <p>
            首次访问 {formatDate(detail.firstSeen)} · 最近访问 {formatDate(detail.lastSeen)}
          </p>
        </div>
        <div className="analytics-admin__stats">
          <Metric label="会话数" value={detail.totalSessions.toLocaleString("zh-CN")} />
          <Metric label="总停留" value={formatDuration(detail.totalDurationMs)} />
          <Metric label="总 PV" value={detail.totalPageViews.toLocaleString("zh-CN")} />
          <Metric label="点击数" value={detail.totalClicks.toLocaleString("zh-CN")} />
          <Metric label="AI 对话" value={detail.chats.length.toLocaleString("zh-CN")} />
        </div>
      </header>

      <section className="analytics-admin__grid">
        <Panel title="IP / 网络历史" wide>
          {detail.ips.length === 0 ? (
            <Empty />
          ) : (
            <ol className="analytics-admin__rank-list">
              {detail.ips.map((ip) => {
                const label = ip.ip || (ip.ipHash ? `#${ip.ipHash.slice(0, 12)}` : "—");
                const desc = [ip.city, ip.region, ip.country, ip.org, ip.asn]
                  .filter(Boolean)
                  .join(" · ") || "未知地区/网络";
                return (
                  <li key={`${ip.ip ?? ip.ipHash ?? label}`}>
                    <span>
                      <strong style={{ display: "block" }}>{label}</strong>
                      <span style={{ color: "#6b6666", fontSize: 12 }}>{desc}</span>
                    </span>
                    <strong>
                      {ip.events} 事件 · {ip.sessions} 会话 · 末 {formatDate(ip.lastSeen)}
                    </strong>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>

        <Panel title="设备分布">
          {detail.devices.length === 0 ? (
            <Empty />
          ) : (
            <ol className="analytics-admin__rank-list">
              {detail.devices.map((device) => (
                <li key={device.label}>
                  <span>{device.label}</span>
                  <strong>{device.count}</strong>
                </li>
              ))}
            </ol>
          )}
        </Panel>

        <Panel title={`会话历史（${detail.sessions.length}）`} wide>
          <div className="analytics-admin__visitor-list">
            {detail.sessions.map((session) => (
              <article key={session.sessionId} className="analytics-admin__visitor analytics-admin__visitor--open">
                <div className="analytics-admin__visitor-head">
                  <div className="analytics-admin__visitor-info">
                    <strong>会话 {truncate(session.sessionId, 18)}</strong>
                    <span className="analytics-admin__visitor-meta">
                      {[session.city, session.country].filter(Boolean).join(" · ") || "未知地区"} ·{" "}
                      {session.org || "普通网络"} · {session.device || "未知设备"}
                    </span>
                    <span className="analytics-admin__visitor-meta">
                      {formatDate(session.startedAt)} → {formatDate(session.lastSeen)}
                    </span>
                  </div>
                  <div className="analytics-admin__visitor-tags">
                    <span className="analytics-admin__tag">{formatDuration(session.durationMs)}</span>
                    <span className="analytics-admin__tag">PV {session.pageViews}</span>
                    <span className="analytics-admin__tag">点击 {session.clicks}</span>
                    <span className="analytics-admin__tag">滚动 {session.maxScrollDepth}%</span>
                    <span className="analytics-admin__tag analytics-admin__tag--ghost">
                      IP {session.ip || (session.ipHash ? `#${session.ipHash.slice(0, 12)}` : "—")}
                    </span>
                  </div>
                </div>
                {session.pages.length > 0 && (
                  <ul className="analytics-admin__visitor-paths">
                    {session.pages.map((page) => (
                      <li key={page.path}>
                        <span>{page.path}</span>
                        <span>
                          {formatDuration(page.durationMs)} · {page.views} 次
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {session.timeline.length > 0 && (
                  <details className="analytics-admin__timeline">
                    <summary>查看完整时间线（{session.timeline.length} 条）</summary>
                    <ul>
                      {session.timeline.map((item, idx) => (
                        <li key={`${item.at}-${idx}`}>
                          <span className="analytics-admin__timeline-time">{formatDate(item.at)}</span>
                          <span className="analytics-admin__timeline-type">{eventTypeLabel(item.type)}</span>
                          <span className="analytics-admin__timeline-detail">{describeTimelineItem(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            ))}
            {detail.sessions.length === 0 ? <Empty /> : null}
          </div>
        </Panel>

        <Panel title={`AI 对话历史（${detail.chats.length}）`} wide>
          <div className="analytics-admin__chat-list">
            {detail.chats.map((record) => (
              <ChatRow key={record.id} record={record} showVisitorLink={false} />
            ))}
            {detail.chats.length === 0 ? <Empty /> : null}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function eventTypeLabel(type: string) {
  switch (type) {
    case "page_view":
      return "页面";
    case "section_view":
      return "区块";
    case "click":
      return "点击";
    case "scroll_depth":
      return "滚动";
    default:
      return "心跳";
  }
}

function describeTimelineItem(item: AnalyticsVisitorTimelineItem) {
  const parts: string[] = [];
  if (item.path) parts.push(item.path);
  if (item.label) parts.push(item.label);
  if (typeof item.depth === "number") parts.push(`${item.depth}%`);
  if (typeof item.durationMs === "number") parts.push(formatDuration(item.durationMs));
  if (item.href) parts.push(`→ ${item.href}`);
  return parts.join(" · ");
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="analytics-admin__metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Panel({
  title,
  children,
  wide,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section className={`analytics-admin__panel${wide ? " analytics-admin__panel--wide" : ""}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Empty() {
  return <p className="analytics-admin__empty">暂无数据</p>;
}
