import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Music as MusicIcon } from "lucide-react";

export function MusicPlayer({ src, title }: { src: string; title?: string | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true); // start muted for autoplay
  const bars = useMemo(() => Array.from({ length: 14 }), []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.6;
    a.muted = true;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [src]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { await a.play(); setPlaying(true); }
    else { a.pause(); setPlaying(false); }
  };
  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  return (
    <div className="glass-strong fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 rounded-2xl px-4 py-3 flex items-center gap-3 max-w-[300px]">
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        onClick={toggle}
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-110"
        style={{ background: "var(--grad-aurora)", color: "white" }}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <MusicIcon className="w-3 h-3" />
          <span>now playing</span>
        </div>
        <div className="font-medium text-sm truncate">{title || "Untitled track"}</div>
        <div className="mt-1.5 flex items-end gap-[2px] h-3" aria-hidden>
          {bars.map((_, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm"
              style={{
                background: "var(--grad-aurora)",
                transformOrigin: "bottom",
                animation: playing ? `eq-bar ${0.6 + (i % 5) * 0.15}s ease-in-out ${i * 0.05}s infinite` : "none",
                transform: playing ? undefined : "scaleY(0.2)",
              }}
            />
          ))}
        </div>
      </div>
      <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground" aria-label="Mute">
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
