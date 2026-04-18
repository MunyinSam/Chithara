'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Textarea } from '@/src/components/ui/textarea';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/src/components/ui/button';

const STYLES = [
  'Lo-fi', 'Pop', 'Hip-hop', 'R&B', 'Jazz', 'Classical',
  'Rock', 'Electronic', 'Acoustic', 'Cinematic',
];

type Status = 'idle' | 'loading' | 'polling' | 'done' | 'error';

interface GenerationResult {
  history_id: number;
  task_id: string;
  status: string;
}

interface HistoryEntry {
  id: number;
  status: string;
  prompt_used: string;
  created_at: string;
  error_message?: string;
  song?: {
    id: number;
    title: string;
    genre: string;
    audio_file: string;
  };
}

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

export default function GenerationPage() {
  const { data: session } = useSession();
  const tokenRef = useRef<string | undefined>(undefined);
  tokenRef.current = session?.backendToken;

  const [prompt, setPrompt]           = useState('');
  const [style, setStyle]             = useState('');
  const [title, setTitle]             = useState('');
  const [instrumental, setInstrumental] = useState(false);
  const [status, setStatus]           = useState<Status>('idle');
  const [error, setError]             = useState('');
  const [result, setResult]           = useState<HistoryEntry | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
  };

  const authHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(tokenRef.current ? { Authorization: `Bearer ${tokenRef.current}` } : {}),
  });

  const pollHistory = (historyId: number) => {
    setStatus('polling');
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API}/history/${historyId}/`, {
          headers: authHeaders(),
        });
        const data: HistoryEntry = await res.json();
        if (data.status === 'COMPLETED') {
          stopPolling();
          setResult(data);
          setStatus('done');
        } else if (data.status === 'FAILED') {
          stopPolling();
          setError(data.error_message ?? 'Generation failed.');
          setStatus('error');
        }
      } catch {
        stopPolling();
        setError('Failed to check generation status.');
        setStatus('error');
      }
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !style || !title.trim()) return;

    setStatus('loading');
    setError('');
    setResult(null);

    try {
      const res = await fetch(`${API}/generate/`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ prompt, style, title, instrumental }),
      });

      if (!res.ok) throw new Error('Failed to start generation.');

      const data: GenerationResult = await res.json();
      pollHistory(data.history_id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  };

  const isSubmitting = status === 'loading' || status === 'polling';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate a Song</h1>
          <p className="text-gray-500 mt-1">Describe your song and let AI do the rest.</p>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Song title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Nights"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  disabled={isSubmitting}
                />
              </div>

              {/* Prompt */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Describe your song</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A calm lo-fi beat for late night studying, melancholic but cozy..."
                  className="resize-none min-h-28"
                  disabled={isSubmitting}
                />
              </div>

              {/* Style */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Style</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStyle(s)}
                      disabled={isSubmitting}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm border transition-all',
                        style === s
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instrumental toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={instrumental}
                  onClick={() => setInstrumental((v) => !v)}
                  disabled={isSubmitting}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                    instrumental ? 'bg-indigo-600' : 'bg-gray-200'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block size-5 rounded-full bg-white shadow transform transition-transform',
                      instrumental ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
                <span className="text-sm text-gray-700">Instrumental only (no vocals)</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !prompt.trim() || !style || !title.trim()}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {status === 'loading' ? 'Submitting...' : status === 'polling' ? 'Generating...' : 'Generate Song'}
              </button>

            </form>
          </CardContent>
        </Card>

        {/* Polling state */}
        {status === 'polling' && (
          <Card className="border-indigo-100 bg-indigo-50">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="size-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin shrink-0" />
              <div>
                <p className="font-medium text-indigo-800">Generating your song…</p>
                <p className="text-sm text-indigo-600 mt-0.5">This usually takes 20–60 seconds. Hang tight.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {status === 'error' && (
          <Card className="border-red-100 bg-red-50">
            <CardContent className="pt-6">
              <p className="font-medium text-red-700">Generation failed</p>
              <p className="text-sm text-red-500 mt-1">{error}</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-3 text-sm text-red-600 underline hover:text-red-800"
              >
                Try again
              </button>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {status === 'done' && result?.song && (
          <Card className="border-green-100 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 text-lg">Your song is ready!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900">{result.song.title}</p>
                <p className="text-sm text-gray-500">{result.song.genre}</p>
              </div>
              <audio
                controls
                src={result.song.audio_file}
                className="w-full mt-2"
              />
              <div className="flex gap-3 pt-1">
                <a
                  href={result.song.audio_file}
                  download
                  className={cn(buttonVariants({ size: 'default' }), 'bg-green-600 hover:bg-green-700 text-white')}
                >
                  Download
                </a>
                <a
                  href="/library"
                  className={cn(buttonVariants({ variant: 'outline', size: 'default' }))}
                >
                  View Library
                </a>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
