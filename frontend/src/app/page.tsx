import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: '🎵',
    title: 'Text to Music',
    body: 'Describe any song in plain English. Our AI handles the rest — genre, mood, tempo, and more.',
  },
  {
    icon: '📚',
    title: 'Your Library',
    body: 'Every generated song is saved to your library. Keep them private or share them with a link.',
  },
  {
    icon: '🕓',
    title: 'Generation History',
    body: "See every prompt you've tried. Revisit past generations and iterate on your ideas.",
  },
];

const steps = [
  {
    n: '1',
    title: 'Write your prompt',
    desc: 'Type what you want: "a calm lofi beat for studying" or "upbeat pop song about summer".',
  },
  {
    n: '2',
    title: 'Pick a style',
    desc: "Choose a genre and vibe to guide the AI's interpretation of your prompt.",
  },
  {
    n: '3',
    title: 'Listen and save',
    desc: 'Your song is ready in seconds. Save it to your library or share it with anyone.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-40 overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Music studio"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 flex flex-col items-center">
          <Badge variant="secondary" className="mb-4 uppercase tracking-wide text-indigo-400 bg-white/10 border-white/20 text-xs">
            AI Music Generation
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-white mb-6">
            Turn your words<br />into music.
          </h1>
          <p className="text-xl text-gray-300 max-w-xl mb-10 leading-relaxed">
            Describe a feeling, a moment, or a vibe. Chithara uses AI to
            generate original songs from your prompts — instantly.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <a href="/generation" className={cn(buttonVariants({ size: 'lg' }), 'bg-indigo-600 hover:bg-indigo-700 text-white')}>
              Generate a Song
            </a>
            <a href="#how-it-works" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm')}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 max-w-5xl mx-auto">
        <p className="text-sm font-medium text-indigo-600 text-center mb-3">Features</p>
        <h2 className="text-3xl font-bold text-center mb-4">Everything you need</h2>
        <p className="text-gray-500 text-center max-w-lg mx-auto mb-14">
          From generation to your personal library — all in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="text-3xl mb-2">{f.icon}</div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm leading-relaxed">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium text-indigo-600 text-center mb-3">How It Works</p>
          <h2 className="text-3xl font-bold text-center mb-14">Three steps to a song</h2>

          <div className="flex flex-col gap-8">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {s.n}
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">{s.title}</h4>
                  <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative flex flex-col items-center text-center px-6 py-32 overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Music studio"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white">
            Ready to make your song?
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-md">
            No instruments. No studio. Just type and listen.
          </p>
          <a href="/generation" className={cn(buttonVariants({ size: 'lg' }), 'bg-indigo-600 hover:bg-indigo-700 text-white px-10')}>
            Get Started — It&apos;s Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
        <span>Chithara © 2025</span>
        <a href="/api-docs" className="hover:text-gray-600 transition-colors">API Docs</a>
      </footer>

    </div>
  );
}
