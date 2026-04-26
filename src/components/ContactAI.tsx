"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/portfolio";

const SUGGESTED = [
  "你的设计风格有哪些标签？",
  "你最适合哪个阶段的初创团队？",
  "Twain 这段经历你是怎么从 0 到 1 的？",
  "你怎么处理产品转型期的设计决策？",
];

function XIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 21.854 19.933" fill="currentColor" aria-hidden>
      <path d="M 17.203 0 L 20.555 0 L 13.234 8.367 L 21.846 19.754 L 15.103 19.754 L 9.819 12.846 L 3.778 19.754 L 0.422 19.754 L 8.252 10.804 L 0 0 L 6.91 0 L 11.687 6.314 L 17.203 0 Z M 16.027 17.747 L 17.884 17.747 L 5.904 1.901 L 3.911 1.901 L 16.027 17.747 Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.06h4.56V24H.22zM7.94 8.06h4.36v2.18h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.48 3.04 5.48 7v9.14h-4.56v-8.1c0-1.93-.04-4.42-2.7-4.42-2.7 0-3.12 2.11-3.12 4.28V24H7.94z" />
    </svg>
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.slice(0, -1) }),
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
    <section id="contact-ai" className="contact-ai">
      <div className="centered contact-ai__centered">
        <div className="contact-ai__col-left">
          <h2 className="contact-ai__title shiny-hover">Contact</h2>
        </div>

        <div className="contact-ai__panel">
          <div ref={listRef} className="contact-ai__list">
            {showGreeting ? (
              <div className="contact-ai__row">
                <div className="contact-ai__avatar" aria-hidden>
                  <span>G</span>
                </div>
                <div className="contact-ai__bubble contact-ai__bubble--bot">
                  你好，我是代表 Gregory 的 AI 助理。
                </div>
              </div>
            ) : (
              messages.map((m, i) =>
                m.role === "assistant" ? (
                  <div key={i} className="contact-ai__row">
                    <div className="contact-ai__avatar" aria-hidden>
                      <span>G</span>
                    </div>
                    <div className="contact-ai__bubble contact-ai__bubble--bot">
                      {m.content || (streaming && i === messages.length - 1 ? "正在思考…" : "")}
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

          <form
            className="contact-ai__form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="contact-ai__socials">
              <a
                href="https://x.com/murynmukha"
                target="_blank"
                rel="noopener"
                aria-label="X"
                className="contact-ai__social-btn"
              >
                <XIcon />
              </a>
              <a
                href="mailto:gregory.murynmukha@gmail.com"
                aria-label="Email"
                className="contact-ai__social-btn"
              >
                <MailIcon />
              </a>
              <a
                href="https://linkedin.com/in/murynmukha"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
                className="contact-ai__social-btn"
              >
                <LinkedInIcon />
              </a>
            </div>
            <div className="contact-ai__input-wrap">
              <input
                className="contact-ai__input"
                placeholder="留言…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={streaming}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
