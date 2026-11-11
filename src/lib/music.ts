import { client } from "@/db";

export type MusicTrack = {
  id: string;
  title: string;
  artist: string | null;
  album: string | null;
  coverUrl: string | null;
  audioUrl: string;
  durationSeconds: number | null;
  sort: number;
  enabled: boolean;
};

export async function getMusicTracks(): Promise<MusicTrack[]> {
  try {
    const rows = await client`
      SELECT id, title, artist, album, cover_url, audio_url, duration_seconds, sort, enabled
      FROM music
      WHERE enabled = true
      ORDER BY sort ASC, created_at ASC
    `;
    return rows.map((row) => ({
      id: row.id as string,
      title: row.title as string,
      artist: row.artist as string | null,
      album: row.album as string | null,
      coverUrl: row.cover_url as string | null,
      audioUrl: row.audio_url as string,
      durationSeconds: row.duration_seconds as number | null,
      sort: row.sort as number,
      enabled: row.enabled as boolean,
    }));
  } catch {
    return [];
  }
}

export async function listAllMusicTracks(): Promise<MusicTrack[]> {
  const rows = await client`
    SELECT id, title, artist, album, cover_url, audio_url, duration_seconds, sort, enabled
    FROM music
    ORDER BY sort ASC, created_at ASC
  `;
  return rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    artist: row.artist as string | null,
    album: row.album as string | null,
    coverUrl: row.cover_url as string | null,
    audioUrl: row.audio_url as string,
    durationSeconds: row.duration_seconds as number | null,
    sort: row.sort as number,
    enabled: row.enabled as boolean,
  }));
}