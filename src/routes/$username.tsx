import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveStorageUrl } from "@/lib/storage";
import { MusicPlayer } from "@/components/profile/MusicPlayer";
import { Particles, AuroraBg } from "@/components/profile/BackgroundFx";
import { ClickEffect, CustomCursor } from "@/components/profile/Effects";
import { LanyardCard } from "@/components/profile/LanyardCard";
import { Guestbook } from "@/components/profile/Guestbook";
import { ExternalLink } from "lucide-react";

type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  discord_id: string | null;
  roblox_url: string | null;
  music_url: string | null;
  music_title: string | null;
  accent_color: string;
  secondary_color: string;
  background_effect: string;
  click_effect: boolean;
  custom_cursor: boolean;
};
type Lnk = { id: string; label: string; url: string; icon: string | null; position: number };

export const Route = createFileRoute("/$username")({
  loader: async ({ params }) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", params.username.toLowerCase())
      .maybeSingle();
    if (error || !profile) throw notFound();
    const { data: links } = await supabase
      .from("links")
      .select("id,label,url,icon,position")
      .eq("profile_id", profile.id)
      .order("position");
    return { profile: profile as Profile, links: (links || []) as Lnk[] };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `@${loaderData.profile.username} — aurora.lol` },
      { name: "description", content: loaderData.profile.bio || `${loaderData.profile.display_name || loaderData.profile.username} on aurora.lol` },
      { property: "og:title", content: `@${loaderData.profile.username} — aurora.lol` },
      { property: "og:description", content: loaderData.profile.bio || "made with aurora.lol" },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-10 text-center max-w-sm">
        <h1 className="text-4xl font-bold text-aurora font-mono">404</h1>
        <p className="mt-2 text-muted-foreground">No profile with that username.</p>
        <Link to="/" className="mt-6 inline-block glass-strong px-4 py-2 rounded-md text-sm hover:glow-purple transition-shadow">
          Claim this username →
        </Link>
      </div>
    </div>
  ),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, links } = Route.useLoaderData();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    resolveStorageUrl("avatars", profile.avatar_url).then(setAvatarUrl);
    resolveStorageUrl("music", profile.music_url).then(setMusicUrl);
    supabase.auth.getUser().then(({ data }) => setIsOwner(data.user?.id === profile.id));
  }, [profile.id, profile.avatar_url, profile.music_url]);

  return (
    <div className="min-h-screen relative">
      {profile.background_effect === "particles" && <Particles color={profile.accent_color} />}
      {profile.background_effect === "aurora" && <AuroraBg accent={profile.accent_color} secondary={profile.secondary_color} />}
      {profile.click_effect && <ClickEffect color={profile.accent_color} />}
      {profile.custom_cursor && <CustomCursor accent={profile.accent_color} secondary={profile.secondary_color} />}

      {isOwner && (
        <Link to="/dashboard" className="fixed top-4 left-4 z-40 glass-strong px-3 py-1.5 rounded-md text-xs font-mono hover:glow-purple transition-shadow">
          edit profile
        </Link>
      )}

      <main className="max-w-2xl mx-auto px-4 py-12 sm:py-20 space-y-6">
        {/* Hero card */}
        <div className="glass-strong rounded-2xl p-8 text-center relative overflow-hidden animate-fade-in-up">
          <div aria-hidden className="absolute inset-0 opacity-30 pointer-events-none"
               style={{ background: `radial-gradient(ellipse at top, ${profile.accent_color}55, transparent 70%)` }} />
          <div className="relative">
            <div className="w-28 h-28 mx-auto rounded-full p-1 animate-pulse-glow"
                 style={{ background: `linear-gradient(135deg, ${profile.accent_color}, ${profile.secondary_color})` }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full rounded-full object-cover bg-background" />
              ) : (
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-3xl font-bold">
                  {(profile.display_name || profile.username)[0].toUpperCase()}
                </div>
              )}
            </div>
            <h1 className="mt-4 text-2xl font-bold">{profile.display_name || profile.username}</h1>
            <div className="font-mono text-sm text-muted-foreground">@{profile.username}</div>
            {profile.bio && <p className="mt-4 text-sm text-foreground/90 whitespace-pre-wrap max-w-md mx-auto">{profile.bio}</p>}
            {profile.roblox_url && (
              <a href={profile.roblox_url} target="_blank" rel="noreferrer"
                 className="mt-5 inline-flex items-center gap-2 glass-strong rounded-full pl-2 pr-4 py-1.5 hover:glow-magenta transition-shadow">
                <span className="w-7 h-7 rounded-full flex items-center justify-center animate-spin-slow"
                      style={{ background: `radial-gradient(circle, ${profile.accent_color}, ${profile.secondary_color})`,
                               boxShadow: `0 0 20px ${profile.accent_color}` }}>
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="white"><path d="M3 3l16 4-4 16L3 3zm5.5 5.5l3 8 5-3-8-5z"/></svg>
                </span>
                <span className="text-xs font-mono">roblox</span>
              </a>
            )}
          </div>
        </div>

        {profile.discord_id && (
          <div className="animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            <LanyardCard discordId={profile.discord_id} />
          </div>
        )}

        {links.length > 0 && (
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
            {links.map((l) => (
              <a key={l.id} href={l.url} target="_blank" rel="noreferrer"
                 className="glass flex items-center justify-between px-4 py-3 hover:glow-purple transition-all hover:-translate-y-0.5 group">
                <span className="font-medium">{l.label}</span>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        )}

        <div className="animate-fade-in-up" style={{ animationDelay: "160ms" }}>
          <Guestbook profileId={profile.id} isOwner={isOwner} />
        </div>

        <footer className="text-center text-xs text-muted-foreground font-mono pt-6">
          <Link to="/" className="hover:text-foreground">made with aurora.lol ✦</Link>
        </footer>
      </main>

      {musicUrl && <MusicPlayer src={musicUrl} title={profile.music_title} />}
    </div>
  );
}
