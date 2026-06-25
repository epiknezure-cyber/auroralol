import { useEffect, useState } from "react";
import { Activity, Gamepad2, Music as MusicIcon } from "lucide-react";

type LanyardData = {
  discord_user: { id: string; username: string; global_name?: string; avatar?: string };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: Array<{
    id: string;
    name: string;
    type: number;
    state?: string;
    details?: string;
    application_id?: string;
    assets?: { large_image?: string; large_text?: string };
  }>;
  listening_to_spotify: boolean;
  spotify?: { song: string; artist: string; album_art_url: string; album: string };
};

const STATUS_COLOR: Record<string, string> = {
  online: "oklch(0.85 0.28 145)",
  idle: "oklch(0.85 0.18 80)",
  dnd: "oklch(0.65 0.27 25)",
  offline: "oklch(0.5 0.04 280)",
};

export function LanyardCard({ discordId }: { discordId: string }) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const fetchIt = async () => {
      try {
        const r = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        const j = await r.json();
        if (!alive) return;
        if (j.success) setData(j.data);
        else setError(j.error?.message || "Not found");
      } catch (e) { if (alive) setError("offline"); }
    };
    fetchIt();
    const t = setInterval(fetchIt, 15000);
    return () => { alive = false; clearInterval(t); };
  }, [discordId]);

  if (error) {
    return (
      <div className="glass p-4 text-sm text-muted-foreground font-mono">
        <span className="opacity-60">discord:</span> {error} (user must join discord.gg/lanyard)
      </div>
    );
  }
  if (!data) {
    return <div className="glass p-4 text-sm text-muted-foreground font-mono">connecting to discord...</div>;
  }

  const status = data.discord_status;
  const game = data.activities.find(a => a.type === 0);
  const spotify = data.listening_to_spotify ? data.spotify : null;

  return (
    <div className="glass p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          {data.discord_user.avatar ? (
            <img src={`https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=64`}
                 alt="" className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted" />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background"
                style={{ background: STATUS_COLOR[status] }} title={status} />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{data.discord_user.global_name || data.discord_user.username}</div>
          <div className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Activity className="w-3 h-3" /> {status}
          </div>
        </div>
      </div>
      {spotify && (
        <a href={`https://open.spotify.com/search/${encodeURIComponent(spotify.song + " " + spotify.artist)}`}
           target="_blank" rel="noreferrer"
           className="flex items-center gap-3 rounded-lg p-2 -mx-1 hover:bg-muted/30">
          <img src={spotify.album_art_url} alt="" className="w-10 h-10 rounded" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-xs text-[oklch(0.85_0.28_145)] font-mono">
              <MusicIcon className="w-3 h-3" /> spotify
            </div>
            <div className="text-sm font-medium truncate">{spotify.song}</div>
            <div className="text-xs text-muted-foreground truncate">{spotify.artist}</div>
          </div>
        </a>
      )}
      {game && (
        <div className="flex items-center gap-3 rounded-lg p-2 -mx-1">
          {game.application_id && game.assets?.large_image ? (
            <img src={resolveAsset(game.application_id, game.assets.large_image)} alt="" className="w-10 h-10 rounded" />
          ) : (
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><Gamepad2 className="w-5 h-5" /></div>
          )}
          <div className="min-w-0">
            <div className="text-xs text-[oklch(0.72_0.27_305)] font-mono flex items-center gap-1">
              <Gamepad2 className="w-3 h-3" /> playing
            </div>
            <div className="text-sm font-medium truncate">{game.name}</div>
            {game.details && <div className="text-xs text-muted-foreground truncate">{game.details}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function resolveAsset(appId: string, asset: string) {
  if (asset.startsWith("mp:external/")) return `https://media.discordapp.net/external/${asset.replace("mp:external/", "")}`;
  return `https://cdn.discordapp.com/app-assets/${appId}/${asset}.png`;
}
