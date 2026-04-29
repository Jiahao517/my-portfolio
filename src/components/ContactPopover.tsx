"use client";

import Image from "next/image";
import {
  useState,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

interface ContactPopoverProps {
  children: ReactNode;
}

export function ContactPopover({ children }: ContactPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onCardMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div
      ref={ref}
      className="contact-popover"
      onClick={() => setOpen((v) => !v)}
    >
      <div
        className={`contact-popover__panel${open ? " is-open" : ""}`}
        role="dialog"
        aria-hidden={!open}
      >
        <div className="contact-popover__grid">
          <div className="contact-popover__col">
            <div
              className="contact-popover__card"
              onPointerMove={onCardMove}
            >
              <span className="contact-popover__hint">EMAIL</span>
              <span className="contact-popover__label">邮箱</span>
              <span className="contact-popover__value">
                zjh532169990@163.com
              </span>
            </div>
            <div
              className="contact-popover__card"
              onPointerMove={onCardMove}
            >
              <span className="contact-popover__hint">PHONE</span>
              <span className="contact-popover__label">手机号</span>
              <span className="contact-popover__value">17681828517</span>
            </div>
          </div>

          <div
            className="contact-popover__card contact-popover__card--wechat"
            onPointerMove={onCardMove}
          >
            <div className="contact-popover__wechat-head">
              <span className="contact-popover__hint">WECHAT</span>
              <span className="contact-popover__label">微信</span>
            </div>
            <div className="contact-popover__qr">
              <Image
                src="/images/wechat-qr.png"
                alt="微信二维码"
                width={160}
                height={160}
                className="contact-popover__qr-img"
              />
            </div>
            <span className="contact-popover__wechat-id">Jiahao0517</span>
          </div>
        </div>
        <span className="contact-popover__arrow" aria-hidden />
      </div>
      {children}
    </div>
  );
}
