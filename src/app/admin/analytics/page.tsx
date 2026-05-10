import { Suspense } from "react";
import { readAnalyticsSummaryInRange } from "@/lib/analytics/storage";
import { resolveRange } from "@/lib/analytics/range";
import { formatDate, formatDuration } from "@/lib/analytics/format";
import { RangeTabs } from "@/components/analytics/RangeTabs";
import { VisitorRow } from "@/components/analytics/VisitorRow";
import { ChatRow } from "@/components/analytics/ChatRow";
import { AnalyticsTrendChart } from "@/components/analytics/AnalyticsTrendChart";
import { AnalyticsHourlyHeatmap } from "@/components/analytics/AnalyticsHourlyHeatmap";
import { AnalyticsPagesBar } from "@/components/analytics/AnalyticsPagesBar";
import { AnalyticsDevicesPie } from "@/components/analytics/AnalyticsDevicesPie";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}

export default async function AnalyticsAdminPage({ searchParams }: Props) {
  const sp = await searchParams;
  const range = resolveRange({ range: sp.range, from: sp.from, to: sp.to });
  const summary = await readAnalyticsSummaryInRange(range);

  const rangeLabel = describeRange(range.preset, range.from, range.to);

  return (
    <main className="analytics-admin">
      <header className="analytics-admin__header">
        <div>
          <p className="analytics-admin__eyebrow">Portfolio Intelligence</p>
          <h1>访问行为分析</h1>
          <p>
            范围：<strong>{rangeLabel}</strong> · 更新于 {formatDate(summary.generatedAt)}
          </p>
          <p className="analytics-admin__note">
            公司网络判断基于城市、ASN 和组织名，只代表概率信号；工作日 9-19 点、杭州、Alibaba/Ant ASN 同时命中时可信度更高。原始 IP 仅在此后台可见。
          </p>
        </div>
        <div className="analytics-admin__stats">
          <Metric label="事件" value={summary.totalEvents.toLocaleString("zh-CN")} />
          <Metric label="会话" value={summary.totalSessions.toLocaleString("zh-CN")} />
          <Metric label="访客" value={summary.totalVisitors.toLocaleString("zh-CN")} />
          <Metric label="AI 对话" value={summary.totalChats.toLocaleString("zh-CN")} />
          <Metric label="疑似阿里/蚂蚁" value={summary.suspectOrgSessions.toLocaleString("zh-CN")} />
        </div>
      </header>

      <Suspense fallback={null}>
        <RangeTabs />
      </Suspense>

      <section className="analytics-admin__charts">
        <Panel title={`访问趋势（按${summary.range.granularity === "hour" ? "小时" : "日"}聚合）`}>
          <AnalyticsTrendChart data={summary.timeSeries} granularity={summary.range.granularity} />
        </Panel>
        <Panel title="访问时段热力图（按本机时区）">
          <AnalyticsHourlyHeatmap data={summary.hourlyHeatmap} />
        </Panel>
        <Panel title="页面访问与停留 Top 8">
          <AnalyticsPagesBar data={summary.pages} />
        </Panel>
        <Panel title="设备分布">
          <AnalyticsDevicesPie data={summary.devices} />
        </Panel>
      </section>

      <section className="analytics-admin__grid">
        <Panel title="最近访客（点击展开）" wide>
          <div className="analytics-admin__visitor-list">
            {summary.recentVisitors.map((visitor) => (
              <VisitorRow key={visitor.sessionId} visitor={visitor} />
            ))}
            {summary.recentVisitors.length === 0 ? <Empty /> : null}
          </div>
        </Panel>

        <Panel title={`ContactAI 问答（${summary.recentChats.length}）`} wide>
          <div className="analytics-admin__chat-list">
            {summary.recentChats.map((record) => (
              <ChatRow key={record.id} record={record} />
            ))}
            {summary.recentChats.length === 0 ? <Empty /> : null}
          </div>
        </Panel>

        <Panel title="页面停留排行">
          <RankList
            items={summary.pages.map((page) => ({
              label: page.path,
              value: `${formatDuration(page.durationMs)} · ${page.views} views`,
            }))}
          />
        </Panel>

        <Panel title="屏幕/区块停留排行">
          <RankList
            items={summary.sections.map((section) => ({
              label: `${section.label} (${section.path})`,
              value: `${formatDuration(section.durationMs)} · ${section.views} views`,
            }))}
          />
        </Panel>

        <Panel title="按钮与链接点击">
          <RankList
            items={summary.clicks.map((click) => ({
              label: `${click.label}${click.href ? ` → ${click.href}` : ""}`,
              value: `${click.count} clicks`,
            }))}
          />
        </Panel>

        <Panel title="滚动深度">
          <RankList
            items={summary.maxScrollDepthByPath.map((scroll) => ({
              label: scroll.path,
              value: `${scroll.maxDepth}% · ${scroll.sessions} sessions`,
            }))}
          />
        </Panel>

        <Panel title="设备分布">
          <RankList items={summary.devices.map((device) => ({ label: device.label, value: `${device.count}` }))} />
        </Panel>

        <Panel title="来源分布">
          <RankList items={summary.referrers.map((referrer) => ({ label: referrer.label, value: `${referrer.count}` }))} />
        </Panel>
      </section>
    </main>
  );
}

function describeRange(preset: string, from?: string, to?: string) {
  switch (preset) {
    case "today":
      return "今日";
    case "7d":
      return "最近 7 天";
    case "30d":
      return "最近 30 天";
    case "all":
      return "全部";
    case "custom":
      return `${from ? formatDate(from) : "起始"} → ${to ? formatDate(to) : "现在"}`;
    default:
      return "全部";
  }
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

function RankList({ items }: { items: Array<{ label: string; value: string }> }) {
  if (items.length === 0) return <Empty />;
  return (
    <ol className="analytics-admin__rank-list">
      {items.slice(0, 12).map((item) => (
        <li key={`${item.label}-${item.value}`}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </li>
      ))}
    </ol>
  );
}

function Empty() {
  return <p className="analytics-admin__empty">暂无数据</p>;
}
