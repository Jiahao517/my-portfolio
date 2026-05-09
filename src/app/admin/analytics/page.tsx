import { readAnalyticsSummary } from "@/lib/analytics/storage";

export const dynamic = "force-dynamic";

function formatDuration(ms: number) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AnalyticsAdminPage() {
  const summary = await readAnalyticsSummary();

  return (
    <main className="analytics-admin">
      <header className="analytics-admin__header">
        <div>
          <p className="analytics-admin__eyebrow">Portfolio Intelligence</p>
          <h1>访问行为分析</h1>
          <p>更新时间：{formatDate(summary.generatedAt)}</p>
          <p className="analytics-admin__note">公司网络判断基于城市、ASN 和组织名，只代表概率信号；工作日 9-19 点、杭州、Alibaba/Ant ASN 同时命中时可信度更高。</p>
        </div>
        <div className="analytics-admin__stats">
          <Metric label="事件" value={summary.totalEvents.toLocaleString("zh-CN")} />
          <Metric label="会话" value={summary.totalSessions.toLocaleString("zh-CN")} />
          <Metric label="访客" value={summary.totalVisitors.toLocaleString("zh-CN")} />
          <Metric label="疑似阿里/蚂蚁" value={summary.suspectOrgSessions.toLocaleString("zh-CN")} />
        </div>
      </header>

      <section className="analytics-admin__grid">
        <Panel title="最近访客">
          <div className="analytics-admin__visitor-list">
            {summary.recentVisitors.map((visitor) => (
              <article key={visitor.sessionId} className="analytics-admin__visitor">
                <div>
                  <strong>{visitor.city || "未知城市"} {visitor.org ? `· ${visitor.org}` : ""}</strong>
                  <p>{visitor.suspectOrg || "普通网络"} · {visitor.device || "未知设备"}</p>
                </div>
                <div className="analytics-admin__visitor-meta">
                  <span>{formatDuration(visitor.durationMs)}</span>
                  <span>{visitor.interest}</span>
                  <span>{visitor.topPage || "无页面停留"}</span>
                  <span>{formatDate(visitor.lastSeen)}</span>
                </div>
              </article>
            ))}
            {summary.recentVisitors.length === 0 ? <Empty /> : null}
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="analytics-admin__metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="analytics-admin__panel">
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
