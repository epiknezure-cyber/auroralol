import { useMemo } from "react";

export function Particles({ count = 40, color }: { count?: number; color?: string }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 8 + Math.random() * 14,
      delay: Math.random() * 12,
      drift: (Math.random() - 0.5) * 80,
    })),
  [count]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: color || "oklch(0.85 0.28 145)",
            boxShadow: `0 0 ${p.size * 4}px ${color || "oklch(0.85 0.28 145)"}`,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
            ["--drift" as never]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export function AuroraBg({ accent, secondary }: { accent: string; secondary: string }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 animate-aurora" style={{
        background: `radial-gradient(ellipse 60% 50% at 20% 10%, ${accent}55, transparent 60%),
                     radial-gradient(ellipse 50% 60% at 90% 80%, ${secondary}55, transparent 60%),
                     radial-gradient(ellipse 70% 40% at 50% 110%, ${accent}33, transparent 60%)`,
        backgroundSize: "200% 200%",
      }} />
    </div>
  );
}
