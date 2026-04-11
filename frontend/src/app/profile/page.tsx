'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/src/components/ui/card';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/src/components/ui/button';

interface Stats {
  total_songs: number;
  public_songs: number;
  total_generations: number;
}

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-5">
      <span className="text-3xl font-bold text-indigo-600">{value}</span>
      <span className="text-xs text-gray-400 mt-1 text-center">{label}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats]     = useState<Stats | null>(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');

  const backendUser = session?.backendUser;
  const googleUser  = session?.user;

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  // Populate form fields from session
  useEffect(() => {
    if (backendUser) {
      setFirstName(backendUser.first_name ?? '');
      setLastName(backendUser.last_name ?? '');
    }
  }, [backendUser]);

  // Fetch stats
  useEffect(() => {
    if (!backendUser?.id) return;
    fetch(`${API}/users/${backendUser.id}/stats/`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, [backendUser?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backendUser?.id) return;
    setSaving(true);
    try {
      await fetch(`${API}/users/${backendUser.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || !backendUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="size-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const displayName = [backendUser.first_name, backendUser.last_name].filter(Boolean).join(' ') || backendUser.username;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your account</p>
        </div>

        {/* Identity card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative size-16 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-100">
                {googleUser?.image ? (
                  <Image
                    src={googleUser.image}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="size-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                    {displayName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name + meta */}
              <div className="min-w-0">
                <p className="text-lg font-semibold text-gray-900 truncate">{displayName}</p>
                <p className="text-sm text-gray-400 truncate">{backendUser.email}</p>
                <p className="text-xs text-gray-300 mt-0.5">
                  Member since {formatDate(backendUser.date_joined)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-700 mb-4">Your activity</p>
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Songs generated" value={stats?.total_songs ?? '—'} />
              <StatCard label="Public songs"    value={stats?.public_songs ?? '—'} />
              <StatCard label="Total prompts"   value={stats?.total_generations ?? '—'} />
            </div>
          </CardContent>
        </Card>

        {/* Edit name */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-700 mb-4">Edit display name</p>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-500">Email</label>
                <input
                  type="text"
                  value={backendUser.email}
                  disabled
                  className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className={cn(
                    buttonVariants({ size: 'default' }),
                    'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60'
                  )}
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                {saved && (
                  <span className="text-sm text-green-600 font-medium">Saved!</span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="flex gap-3">
          <a
            href="/library"
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }))}
          >
            Your Library
          </a>
          <a
            href="/generation"
            className={cn(buttonVariants({ size: 'default' }), 'bg-indigo-600 hover:bg-indigo-700 text-white')}
          >
            + New Song
          </a>
        </div>

      </div>
    </div>
  );
}
