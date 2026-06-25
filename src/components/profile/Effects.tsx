import { useEffect } from "react";

export function ClickEffect({ color }: { color: string }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = document.createElement("span");
      el.style.cssText = `
        position: fixed;
        left: ${e.clientX - 12}px;
        top: ${e.clientY - 12}px;
        width: 24px; height: 24px;
        border-radius: 999px;
        pointer-events: none;
        z-index: 9999;
        background: radial-gradient(circle, ${color}, transparent 70%);
        box-shadow: 0 0 30px ${color};
        animation: burst 0.6s ease-out forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 700);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [color]);
  return null;
}

export function CustomCursor({ accent, secondary }: { accent: string; secondary: string }) {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.style.cssText = `
      position: fixed;
      width: 22px; height: 22px;
      border-radius: 999px;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, ${accent}, ${secondary});
      box-shadow: 0 0 20px ${accent}, 0 0 40px ${secondary};
      mix-blend-mode: screen;
      transition: transform 0.08s ease-out;
    `;
    document.body.appendChild(cursor);
    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", move);
    return () => { window.removeEventListener("mousemove", move); cursor.remove(); };
  }, [accent, secondary]);
  return null;
}
