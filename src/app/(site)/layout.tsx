import { Suspense, type ReactNode } from "react";
import { getSettings } from "@/lib/settings";
import { getMusicTracks } from "@/lib/music";
import { getI18n } from "@/i18n/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { MusicPlayer } from "@/components/music-player";
import { NavProgress } from "@/components/nav-progress";
import { RouteTransitions } from "@/components/route-transitions";
import { CardSpotlight } from "@/components/card-spotlight";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [{ locale, messages }, settings, tracks] = await Promise.all([getI18n(), getSettings(), getMusicTracks()]);
  return (
    <>
      <Suspense fallback={null}>
        <NavProgress />
        <RouteTransitions />
      </Suspense>
      <CardSpotlight />
      <ScrollProgress />
      <SiteHeader settings={settings} locale={locale} messages={messages} />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} locale={locale} messages={messages} />
      <MusicPlayer tracks={tracks} messages={messages} locale={locale} />
    </>
  );
}