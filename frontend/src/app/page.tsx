export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        backgroundColor: "#f5f0e8",
        color: "#1a1008",
      }}
    >
      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center text-center px-6 py-32"
        style={{ borderBottom: "2px solid #1a1008" }}
      >
        <div className="flex items-center gap-4 mb-10 w-full max-w-xl">
          <div style={{ flex: 1, height: "2px", backgroundColor: "#1a1008" }} />
          <span className="text-xs tracking-[0.4em] uppercase">Est. 2025</span>
          <div style={{ flex: 1, height: "2px", backgroundColor: "#1a1008" }} />
        </div>

        <h1
          className="text-7xl font-bold leading-tight mb-6"
          style={{ letterSpacing: "-0.02em" }}
        >
          Music, Born
          <br />
          From Words.
        </h1>

        <p
          className="text-xl max-w-lg mb-12 leading-relaxed"
          style={{ color: "#4a3b2a" }}
        >
          Describe a feeling. A moment. A memory. Chithara transforms your words
          into original music — instantly.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="/generation"
            style={{
              backgroundColor: "#1a1008",
              color: "#f5f0e8",
              border: "2px solid #1a1008",
            }}
            className="px-8 py-3 text-base tracking-widest uppercase hover:opacity-80 transition-opacity"
          >
            Generate a Song
          </a>
          <a
            href="#how-it-works"
            style={{
              backgroundColor: "transparent",
              color: "#1a1008",
              border: "2px solid #1a1008",
            }}
            className="px-8 py-3 text-base tracking-widest uppercase hover:bg-stone-200 transition-colors"
          >
            Learn More
          </a>
        </div>

        <div className="flex items-center gap-4 mt-16 w-full max-w-xl">
          <div style={{ flex: 1, height: "1px", backgroundColor: "#1a1008" }} />
          <span style={{ fontSize: "1.5rem" }}>♩ ♪ ♫ ♬</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#1a1008" }} />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="px-8 py-24"
        style={{ borderBottom: "2px solid #1a1008" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs tracking-[0.5em] uppercase mb-2 text-center">
            What We Offer
          </h2>
          <h3 className="text-4xl font-bold text-center mb-16">
            Everything You Need
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              {
                symbol: "I.",
                title: "Text to Music",
                body: "Write a prompt in plain English. Our AI composes original audio that matches your vision — genre, mood, and all.",
              },
              {
                symbol: "II.",
                title: "Your Library",
                body: "Every song you generate is saved to your personal library. Revisit, share, or keep them private — your choice.",
              },
              {
                symbol: "III.",
                title: "Generation History",
                body: "Track every prompt you've tried. Iterate on your ideas and see how your music has evolved over time.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-8"
                style={{
                  borderLeft: i === 0 ? "2px solid #1a1008" : "none",
                  borderRight: "2px solid #1a1008",
                  borderTop: "2px solid #1a1008",
                  borderBottom: "2px solid #1a1008",
                }}
              >
                <div
                  className="text-4xl font-bold mb-4"
                  style={{ color: "#8b6f4e" }}
                >
                  {f.symbol}
                </div>
                <h4 className="text-xl font-bold mb-3 tracking-wide">
                  {f.title}
                </h4>
                <p className="leading-relaxed" style={{ color: "#4a3b2a" }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="px-8 py-24"
        style={{
          backgroundColor: "#1a1008",
          color: "#f5f0e8",
          borderBottom: "2px solid #1a1008",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xs tracking-[0.5em] uppercase mb-2 opacity-60">
            The Process
          </h2>
          <h3 className="text-4xl font-bold mb-16">Three Steps to a Song</h3>

          <div className="flex flex-col gap-0">
            {[
              {
                step: "01",
                title: "Write Your Prompt",
                desc: 'Type a description like "a melancholic jazz piece for a rainy evening" or "upbeat folk with acoustic guitar".',
              },
              {
                step: "02",
                title: "Choose Your Style",
                desc: "Select a genre and a vibe to refine the AI's interpretation of your prompt.",
              },
              {
                step: "03",
                title: "Listen & Save",
                desc: "Your song is generated in seconds. Listen instantly, save it to your library, or share it with a link.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex gap-8 items-start p-8 text-left"
                style={{
                  borderBottom:
                    i < 2 ? "1px solid rgba(245,240,232,0.2)" : "none",
                }}
              >
                <span
                  className="text-5xl font-bold shrink-0"
                  style={{ color: "rgba(245,240,232,0.2)" }}
                >
                  {s.step}
                </span>
                <div>
                  <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                  <p
                    style={{ color: "rgba(245,240,232,0.7)" }}
                    className="leading-relaxed"
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-28 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center gap-3 text-3xl mb-8">
            ♩ ♪ ♫ ♬
          </div>
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Your Next Favourite Song
            <br />
            Hasn&apos;t Been Written Yet.
          </h2>
          <p
            className="text-lg mb-10 leading-relaxed"
            style={{ color: "#4a3b2a" }}
          >
            Be the one to write it. No instruments. No studio. Just your words.
          </p>
          <a
            href="/generation"
            style={{
              backgroundColor: "#1a1008",
              color: "#f5f0e8",
              border: "2px solid #1a1008",
            }}
            className="inline-block px-10 py-4 text-base tracking-widest uppercase hover:opacity-80 transition-opacity"
          >
            Start Generating — It&apos;s Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-8 py-8 flex items-center justify-between text-sm tracking-widest uppercase"
        style={{
          borderTop: "2px solid #1a1008",
          color: "#4a3b2a",
        }}
      >
        <span>Chithara © 2025</span>
        <span>♫ All rights reserved</span>
        <a href="/api-docs" className="hover:underline underline-offset-4">
          API Docs
        </a>
      </footer>
    </div>
  );
}
