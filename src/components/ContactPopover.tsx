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
  placement?: "above" | "below" | "auto";
}

const POPOVER_HEIGHT = 220;

export function ContactPopover({ children, placement = "auto" }: ContactPopoverProps) {
  const [open, setOpen] = useState(false);
  const [resolvedPlacement, setResolvedPlacement] = useState<"above" | "below">("above");
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
    const handleScroll = () => setOpen(false);
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  const effectivePlacement = placement === "auto" ? resolvedPlacement : placement;

  const panelClass = [
    "contact-popover__panel",
    effectivePlacement === "below" ? "contact-popover__panel--below" : "",
    open ? "is-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleToggle = () => {
    if (!open && placement === "auto" && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setResolvedPlacement(rect.top >= POPOVER_HEIGHT ? "above" : "below");
    }
    setOpen((v) => !v);
  };

  return (
    <div
      ref={ref}
      className="contact-popover"
      onClick={handleToggle}
    >
      <div
        className={panelClass}
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
