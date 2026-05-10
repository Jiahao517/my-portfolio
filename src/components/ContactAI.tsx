"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/portfolio";
import { BorderGlow } from "@/components/BorderGlow";
import { ChatMarkdown } from "@/components/ChatMarkdown";

const SUGGESTED = [
  "他的个人亮点是什么？",
  "他是怎么把 AI Coding 融入设计工作流的？",
  "他最有成就感的项目是什么？",
  "他的离职原因是什么？",
];

function readAnalyticsIds() {
  if (typeof window === "undefined") return { visitorId: undefined, sessionId: undefined };
  try {
    return {
      visitorId: window.localStorage.getItem("portfolio_analytics_visitor_id") ?? undefined,
      sessionId: window.sessionStorage.getItem("portfolio_analytics_session_id") ?? undefined,
    };
  } catch {
    return { visitorId: undefined, sessionId: undefined };
  }
}

function ThinkingDots() {
  return (
    <span className="contact-ai__thinking-dots" aria-label="正在思考">
      <span />
      <span />
      <span />
    </span>
  );
}

function AssistantAvatar() {
  return (
    <div className="contact-ai__avatar" aria-hidden>
      <Image
        src="/images/assistant-avatar.png"
        alt=""
        width={48}
        height={48}
        sizes="48px"
        className="contact-ai__avatar-img"
      />
    </div>
  );
}

export function ContactAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  const send = async (content: string) => {
    if (!content.trim() || streaming) return;
    setError(null);
    const next = [...messages, { role: "user" as const, content }, { role: "assistant" as const, content: "" }];
    setMessages(next);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const ids = readAnalyticsIds();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(0, -1),
          visitorId: ids.visitorId,
          sessionId: ids.sessionId,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `请求失败（${res.status}）`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        setMessages((curr) => {
          const updated = [...curr];
          updated[updated.length - 1] = { role: "assistant", content: buffer };
          return updated;
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "网络异常，请稍后再试";
      setError(msg);
      setMessages((curr) => curr.slice(0, -1));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const showGreeting = messages.length === 0;

  return (
    <section id="contact-ai" className="contact-ai" data-analytics-section="contact-ai">
      <div className="centered contact-ai__centered">
        <div className="contact-ai__col-left">
          <h2 className="contact-ai__title shiny-hover">与我的 AI 作品集助理聊聊</h2>
        </div>

        <div className={`contact-ai__panel${showGreeting ? "" : " contact-ai__panel--chat"}`}>
          <div ref={listRef} className="contact-ai__list">
            {showGreeting ? (
              <div className="contact-ai__row">
                <AssistantAvatar />
                <div className="contact-ai__bubble contact-ai__bubble--bot">
                  <ChatMarkdown content="你好，我是钟家豪的 AI 作品集助理。我基于他的简历、作品集内容，帮助你快速了解他的 AI 产品设计经验、项目方法和能力特点。" />
                </div>
              </div>
            ) : (
              messages.map((m, i) =>
                m.role === "assistant" ? (
                  <div key={i} className="contact-ai__row">
                    <AssistantAvatar />
                    <div className="contact-ai__bubble contact-ai__bubble--bot">
                      {!m.content && streaming && i === messages.length - 1
                        ? <ThinkingDots />
                        : <ChatMarkdown content={m.content} />
                      }
                    </div>
                  </div>
                ) : (
                  <div key={i} className="contact-ai__row contact-ai__row--me">
                    <div className="contact-ai__bubble contact-ai__bubble--me">{m.content}</div>
                  </div>
                ),
              )
            )}
            {error ? <div className="contact-ai__error">{error}</div> : null}
          </div>

          <div className="contact-ai__composer">
            {showGreeting ? (
              <div className="contact-ai__suggestions">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="contact-ai__chip"
                    onClick={() => send(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="contact-ai__bottom">
              <form
                className="contact-ai__form"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <BorderGlow
                  colors={["#208CFF", "#00B4CB", "#00D0AD"]}
                  borderRadius={16}
                  borderWidth={1.5}
                  edgeSensitivity={40}
                  glowRadius={50}
                  coneSpread={30}
                  style={{ flex: 1 }}
                >
                  <div className="contact-ai__input-wrap">
                    <textarea
                      className="contact-ai__input"
                      placeholder="有问题就问我..."
                      rows={2}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={streaming}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          send(input);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      className="contact-ai__send-btn"
                      disabled={streaming || !input.trim()}
                      aria-label="发送"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 15V3M9 3L4 8M9 3l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </BorderGlow>
              </form>

              <p className="contact-ai__disclaimer">
                基于简历与作品集内容生成回答，仅作参考，欢迎面试中进一步沟通确认。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
