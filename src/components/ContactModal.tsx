"use client";

import Image from "next/image";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";

interface ContactModalContextValue {
  openModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextValue>({
  openModal: () => {},
});

export function useContactModal() {
  return useContext(ContactModalContext);
}

function onCardMove(e: ReactPointerEvent<HTMLDivElement>) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  card.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

function ContactModalSheet({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="contact-modal__backdrop" onClick={onClose}>
      <div
        className="contact-modal__sheet"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="contact-modal__header">
          <span className="contact-modal__title">联系我</span>
          <button className="contact-modal__close" onClick={onClose} aria-label="关闭">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="contact-popover__grid">
          <div className="contact-popover__col">
            <div className="contact-popover__card" onPointerMove={onCardMove}>
              <span className="contact-popover__label">邮箱</span>
              <span className="contact-popover__value">zjh532169990@163.com</span>
            </div>
            <div className="contact-popover__card" onPointerMove={onCardMove}>
              <span className="contact-popover__label">手机号</span>
              <span className="contact-popover__value">17681828517</span>
            </div>
          </div>
          <div
            className="contact-popover__card contact-popover__card--wechat"
            onPointerMove={onCardMove}
          >
            <div className="contact-popover__wechat-head">
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
      </div>
    </div>
  );
}

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <ContactModalContext.Provider value={{ openModal }}>
      {children}
      {open && <ContactModalSheet onClose={closeModal} />}
    </ContactModalContext.Provider>
  );
}
