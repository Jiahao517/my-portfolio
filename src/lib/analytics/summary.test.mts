import test from "node:test";
import assert from "node:assert/strict";
import { buildAnalyticsSummary } from "./summary.ts";
import type { AnalyticsEventRecord } from "./types.ts";

const baseEvent = {
  sessionId: "s1",
  visitorId: "v1",
  path: "/",
  title: "首页",
  referrer: "",
  screen: { width: 1440, height: 900, dpr: 2 },
  viewport: { width: 1440, height: 900 },
  device: { userAgent: "Chrome", language: "zh-CN", timezone: "Asia/Shanghai" },
  visitor: {
    ipHash: "hash-1",
    city: "Hangzhou",
    region: "Zhejiang",
    country: "CN",
    asn: "AS37963",
    org: "Alibaba (US) Technology Co., Ltd.",
    suspectOrg: "Alibaba/Ant related network",
  },
};

function event(overrides: Partial<AnalyticsEventRecord>): AnalyticsEventRecord {
  return {
    ...baseEvent,
    id: `evt-${Math.random()}`,
    type: "page_view",
    timestamp: "2026-05-09T12:00:00.000Z",
    receivedAt: "2026-05-09T12:00:00.000Z",
    ...overrides,
  } as AnalyticsEventRecord;
}

test("buildAnalyticsSummary aggregates sessions, pages, clicks, sections, and suspicious organizations", () => {
  const summary = buildAnalyticsSummary([
    event({ type: "page_view", path: "/" }),
    event({ type: "heartbeat", path: "/", durationMs: 15000 }),
    event({ type: "heartbeat", path: "/wencai", durationMs: 30000 }),
    event({ type: "section_view", path: "/", sectionId: "case-studies", sectionLabel: "案例", durationMs: 32000 }),
    event({ type: "click", path: "/", targetText: "联系我", targetRole: "button" }),
    event({ type: "scroll_depth", path: "/", depth: 75 }),
    event({
      type: "page_view",
      sessionId: "s2",
      visitorId: "v2",
      path: "/dingtalk",
      timestamp: "2026-05-09T12:01:00.000Z",
      visitor: { ipHash: "hash-2", city: "Shanghai", country: "CN" },
    }),
  ]);

  assert.equal(summary.totalSessions, 2);
  assert.equal(summary.suspectOrgSessions, 1);
  assert.equal(summary.recentVisitors[0].sessionId, "s2");
  assert.equal(summary.pages[0].path, "/wencai");
  assert.equal(summary.pages[0].durationMs, 30000);
  assert.equal(summary.clicks[0].label, "联系我");
  assert.equal(summary.sections[0].label, "案例");
  assert.equal(summary.maxScrollDepthByPath[0].maxDepth, 75);
  assert.equal(summary.recentVisitors[1].interest, "有联系意向");
});

test("buildAnalyticsSummary uses section dwell time as a duration fallback", () => {
  const summary = buildAnalyticsSummary([
    event({ type: "page_view", sessionId: "s-section", visitorId: "v-section", path: "/" }),
    event({
      type: "section_view",
      sessionId: "s-section",
      visitorId: "v-section",
      path: "/",
      sectionId: "hero",
      sectionLabel: "Hero",
      durationMs: 4200,
    }),
  ]);

  assert.equal(summary.recentVisitors[0].durationMs, 4200);
});
