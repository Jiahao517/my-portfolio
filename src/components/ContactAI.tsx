"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/portfolio";

const SUGGESTED = [
  "你的设计风格有哪些标签？",
  "你最适合哪个阶段的初创团队？",
  "Twain 这段经历你是怎么从 0 到 1 的？",
  "你怎么处理产品转型期的设计决策？",
];

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

  return (
    <section id="contact-ai" className="contact-ai">
      <div className="centered contact-ai__centered">
        <div className="contact-ai__col-left">
          <h2 className="contact-ai__title shiny-hover">问问关于 Gregory 的任何事</h2>
          <p className="contact-ai__subtitle">
            这里接的是真实的 LLM。问背景、问案例、问合作方式都可以。回答受限于他公开过的资料，避免胡编。
          </p>
        </div>

        <div className="contact-ai__panel">
          <div className="contact-ai__panel-head">
            <div className="contact-ai__avatar">
              <span aria-hidden>G</span>
            </div>
            <div>
              <div className="contact-ai__panel-name">Gregory · AI</div>
              <div className="contact-ai__panel-role">代表本人回答访客问题</div>
            </div>
          </div>

          <div ref={listRef} className="contact-ai__list">
            {messages.length === 0 ? (
              <div className="contact-ai__bubble contact-ai__bubble--bot">
                你好，我是代表 Gregory 的 AI 助理。下面有几个常见问题，你也可以直接打字提问。
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`contact-ai__bubble contact-ai__bubble--${m.role === "user" ? "me" : "bot"}`}
                >
                  {m.content || (streaming && i === messages.length - 1 ? "正在思考…" : "")}
                </div>
              ))
            )}
            {error ? <div className="contact-ai__error">{error}</div> : null}
          </div>

          {messages.length === 0 ? (
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
              <a href="https://linkedin.com/in/murynmukha" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>
              <a href="https://github.com/gregorymm" target="_blank" rel="noopener" aria-label="GitHub">gh</a>
              <a href="https://dribbble.com/murynmukha" target="_blank" rel="noopener" aria-label="Dribbble">db</a>
            </div>
            <input
              className="contact-ai__input"
              placeholder="输入你的问题，回车发送…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={streaming}
            />
            <button
              type="submit"
              className="contact-ai__send"
              disabled={!input.trim() || streaming}
            >
              发送
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
