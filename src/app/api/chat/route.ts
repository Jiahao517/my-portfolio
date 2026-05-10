import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/data/persona";
import { appendChatRecord } from "@/lib/analytics/chat-store";
import { getVisitorInfoForRequest } from "@/lib/analytics/storage";
import type { ChatMessage } from "@/types/portfolio";

export const runtime = "nodejs";

const RATE = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX = 10;
const MAX_MESSAGES = 24;
const MAX_CONTENT_CHARS = 2000;
const MAX_TOTAL_CHARS = 8000;

function rateLimit(ip: string) {
  const now = Date.now();
  const cur = RATE.get(ip);
  if (!cur || cur.reset < now) {
    RATE.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (cur.count >= MAX) return false;
  cur.count += 1;
  return true;
}

function getClientIp(req: NextRequest): string {
  // Prefer trusted, single-value platform headers; fall back to first hop of XFF.
  const candidates = [
    req.headers.get("x-vercel-forwarded-for"),
    req.headers.get("cf-connecting-ip"),
    req.headers.get("x-real-ip"),
    req.headers.get("x-forwarded-for")?.split(",")[0],
  ];
  for (const c of candidates) {
    const v = c?.trim();
    if (v) return v;
  }
  return "anon";
}

type ChatBody = { messages?: ChatMessage[]; visitorId?: string; sessionId?: string };

function lastUserMessage(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

async function persistChat(args: {
  req: NextRequest;
  visitorId?: string;
  sessionId?: string;
  userMessage: string;
  assistantMessage: string;
  durationMs: number;
  model: string;
  error?: string;
}) {
  try {
    const visitor = await getVisitorInfoForRequest(args.req);
    await appendChatRecord({
      id: randomUUID(),
      sessionId: args.sessionId || `anon-${visitor.ipHash ?? "unknown"}`,
      visitorId: args.visitorId || `anon-${visitor.ipHash ?? "unknown"}`,
      timestamp: new Date().toISOString(),
      visitor,
      userMessage: args.userMessage,
      assistantMessage: args.assistantMessage,
      durationMs: args.durationMs,
      model: args.model,
      error: args.error,
    });
  } catch (err) {
    console.warn("[chat] failed to persist record", err);
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    return new Response("请求过于频繁，请 5 分钟后再试。", { status: 429 });
  }

  let body: ChatBody;
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return new Response("请求体格式错误", { status: 400 });
  }
  const inMsgs = Array.isArray(body.messages) ? body.messages : [];
  if (inMsgs.length === 0) return new Response("缺少消息", { status: 400 });
  if (inMsgs.length > MAX_MESSAGES) {
    return new Response("会话过长，请重新开始", { status: 400 });
  }

  let totalChars = 0;
  for (const m of inMsgs) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") {
      return new Response("消息格式错误", { status: 400 });
    }
    if (m.content.length > MAX_CONTENT_CHARS) {
      return new Response("单条消息过长", { status: 413 });
    }
    totalChars += m.content.length;
  }
  if (totalChars > MAX_TOTAL_CHARS) {
    return new Response("会话内容过长", { status: 413 });
  }

  const visitorId = typeof body.visitorId === "string" ? body.visitorId.slice(0, 96) : undefined;
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 96) : undefined;
  const userMessage = lastUserMessage(inMsgs);
  const startedAt = Date.now();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Graceful local fallback so the UI is testable without a key.
    const lines = [
      "（演示回退：尚未配置 OPENAI_API_KEY。）",
      "把 OPENAI_API_KEY 加进线上运行环境后，这里就会接到 GPT-4.1 真实回答。",
    ];
    const fallbackText = lines.join("\n");
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const enc = new TextEncoder();
        let i = 0;
        const id = setInterval(() => {
          if (i >= lines.length) {
            clearInterval(id);
            controller.close();
            void persistChat({
              req,
              visitorId,
              sessionId,
              userMessage,
              assistantMessage: fallbackText,
              durationMs: Date.now() - startedAt,
              model: "fallback",
            });
            return;
          }
          controller.enqueue(enc.encode(lines[i] + "\n"));
          i += 1;
        }, 320);
      },
    });
    return new Response(stream, {
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }

  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com").replace(/\/$/, "");
  const upstream = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      stream: true,
      temperature: 0.5,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...inMsgs.slice(-12),
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    void persistChat({
      req,
      visitorId,
      sessionId,
      userMessage,
      assistantMessage: "",
      durationMs: Date.now() - startedAt,
      model: "gpt-4.1-mini",
      error: text || `upstream ${upstream.status}`,
    });
    return new Response(text || "上游服务异常", { status: upstream.status });
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let assistantBuffer = "";
  let streamError: string | undefined;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let idx;
          while ((idx = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, idx).trim();
            buffer = buffer.slice(idx + 1);
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
              const piece = parsed.choices?.[0]?.delta?.content;
              if (piece) {
                assistantBuffer += piece;
                controller.enqueue(encoder.encode(piece));
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      } catch (err) {
        streamError = err instanceof Error ? err.message : "stream error";
      } finally {
        controller.close();
        void persistChat({
          req,
          visitorId,
          sessionId,
          userMessage,
          assistantMessage: assistantBuffer,
          durationMs: Date.now() - startedAt,
          model: "gpt-4.1-mini",
          error: streamError,
        });
      }
    },
  });

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}
