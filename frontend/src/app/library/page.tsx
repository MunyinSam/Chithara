'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/src/components/ui/card';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/src/components/ui/button';
import AudioPlayer from '@/src/components/AudioPlayer';

interface Song {
  id: number;
  title: string;
  genre: string;
  prompt: string;
  audio_file: string;
  created_at: string;
  privacy_status: 'PUBLIC' | 'PRIVATE';
  share_token: string | null;
}

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function SongCard({
  song,
  active,
  onSelect,
  onTogglePrivacy,
}: {
  song: Song;
  active: boolean;
  onSelect: (song: Song) => void;
  onTogglePrivacy: (song: Song) => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyShareLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/songs/${song.share_token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      onClick={() => onSelect(song)}
      className={cn(
        'group cursor-pointer transition-all hover:shadow-md',
        active && 'ring-2 ring-indigo-500 shadow-md'
      )}
    >
      <CardContent className="pt-5 space-y-3">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {/* Playing indicator */}
              {active && (
                <span className="flex gap-0.5 items-end h-4 shrink-0">
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="w-0.5 bg-indigo-600 rounded-full animate-pulse"
                      style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
              )}
              <p className="font-semibold text-gray-900 truncate text-sm">{song.title}</p>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{song.genre} · {formatDate(song.created_at)}</p>
          </div>
          <span className={cn(
            'shrink-0 px-2 py-0.5 rounded-full text-xs font-medium',
            song.privacy_status === 'PUBLIC'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          )}>
            {song.privacy_status === 'PUBLIC' ? 'Public' : 'Private'}
          </span>
        </div>

        {/* Prompt */}
        <p className="text-sm text-gray-500 line-clamp-2 italic">&ldquo;{song.prompt}&rdquo;</p>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap pt-1" onClick={(e) => e.stopPropagation()}>
          <a
            href={song.audio_file}
            download
            className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
          >
            Download
          </a>
          <button
            onClick={() => onTogglePrivacy(song)}
            className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
          >
            {song.privacy_status === 'PUBLIC' ? 'Make Private' : 'Make Public'}
          </button>
          {song.privacy_status === 'PUBLIC' && song.share_token && (
            <button
              onClick={copyShareLink}
              className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          )}
        </div>

      </CardContent>
    </Card>
  );
}

export default function LibraryPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [songs, setSongs]           = useState<Song[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filter, setFilter]         = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');
  const [activeSong, setActiveSong] = useState<Song | null>(null);

  const authHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(session?.backendToken ? { Authorization: `Bearer ${session.backendToken}` } : {}),
  });

  useEffect(() => {
    if (sessionStatus === 'loading' || !session?.backendToken) return;
    const token = session.backendToken;
    fetch(`${API}/songs/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => { setSongs(Array.isArray(data) ? data : (data.results ?? [])); setLoading(false); })
      .catch(() => { setError('Failed to load songs.'); setLoading(false); });
  }, [session?.backendToken, sessionStatus]);

  const togglePrivacy = async (song: Song) => {
    const next = song.privacy_status === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
    const res = await fetch(`${API}/songs/${song.id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ privacy_status: next }),
    });
    if (res.ok) {
      const updated: Song = await res.json();
      setSongs((prev) => prev.map((s) => s.id === updated.id ? updated : s));
      if (activeSong?.id === updated.id) setActiveSong(updated);
    }
  };

  const selectSong = (song: Song) => {
    setActiveSong((prev) => prev?.id === song.id ? null : song);
  };

  const filtered = filter === 'ALL' ? songs : songs.filter((s) => s.privacy_status === filter);

  return (
    <>
      <div className={cn('min-h-screen bg-gray-50 py-12 px-6 transition-all', activeSong && 'pb-32')}>
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Library</h1>
              <p className="text-gray-500 mt-1">{songs.length} song{songs.length !== 1 ? 's' : ''} generated</p>
            </div>
            <a
              href="/generation"
              className={cn(buttonVariants({ size: 'default' }), 'bg-indigo-600 hover:bg-indigo-700 text-white')}
            >
              + New Song
            </a>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-white border border-gray-100 rounded-lg p-1 w-fit">
            {(['ALL', 'PUBLIC', 'PRIVATE'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {f === 'ALL' ? 'All' : f === 'PUBLIC' ? 'Public' : 'Private'}
              </button>
            ))}
          </div>

          {/* States */}
          {(loading || sessionStatus === 'loading') && (
            <div className="flex justify-center py-20">
              <div className="size-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
            </div>
          )}

          {sessionStatus !== 'loading' && !session?.backendToken && (
            <p className="text-center text-red-500 py-10">
              Session expired — please sign out and sign back in.
            </p>
          )}

          {error && (
            <p className="text-center text-red-500 py-10">{error}</p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20 space-y-3">
              <p className="text-gray-400 text-lg">No songs here yet.</p>
              <a
                href="/generation"
                className={cn(buttonVariants({ size: 'default' }), 'bg-indigo-600 hover:bg-indigo-700 text-white')}
              >
                Generate your first song
              </a>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  active={activeSong?.id === song.id}
                  onSelect={selectSong}
                  onTogglePrivacy={togglePrivacy}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      <AudioPlayer
        song={activeSong}
        onClose={() => setActiveSong(null)}
      />
    </>
  );
}
