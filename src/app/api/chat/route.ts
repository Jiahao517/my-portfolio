import type { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/data/persona";
import type { ChatMessage } from "@/types/portfolio";

export const runtime = "nodejs";

const RATE = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX = 10;

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

type ChatBody = { messages?: ChatMessage[] };

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Graceful local fallback so the UI is testable without a key.
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const enc = new TextEncoder();
        const lines = [
          "（演示回退：尚未配置 OPENAI_API_KEY。）",
          "把 OPENAI_API_KEY 加进 Vercel 环境变量后，这里就会接到 GPT-4.1 真实回答。",
        ];
        let i = 0;
        const id = setInterval(() => {
          if (i >= lines.length) {
            clearInterval(id);
            controller.close();
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

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1",
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
    return new Response(text || "上游服务异常", { status: upstream.status });
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

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
              if (piece) controller.enqueue(encoder.encode(piece));
            } catch {
              // skip malformed lines
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}
