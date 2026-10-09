"use client";

import { useCallback, useEffect, useState } from "react";
import type { ImageRoundDetail } from "@/lib/rounds";
import SiteNav from "@/components/SiteNav";

const DOT_COLORS = ["#ffd93f", "#ff6fae", "#5ce0b8", "#9dc1ff"];

export default function RoundViewer({ round }: { round: ImageRoundDetail }) {
  const [index, setIndex] = useState(0);
  const total = round.images.length;

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const src = `/api/image/${round.slug}/${round.images[index]}`;

  return (
    <main className="flex min-h-screen flex-1 flex-col">
      <SiteNav
        eyebrow="now playing"
        title={round.title}
        badge={`${index + 1}/${total}`}
        backHref="/"
      />

      {/* Stage */}
      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-6">
        <div className="relative flex w-full items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Previous"
            className="icon-btn hidden shrink-0 text-lg font-bold sm:flex"
          >
            ←
          </button>

          <div className="hard w-full max-w-2xl bg-white p-4 sm:p-5">
            <img
              key={src}
              src={src}
              alt={`${round.title} question ${index + 1}`}
              className="max-h-[62vh] w-full animate-[fadeIn_0.25s_ease-out] rounded-sm border-2 border-[#141311]/10 bg-[#f8f7f2] object-contain"
            />
          </div>

          <button
            onClick={next}
            aria-label="Next"
            className="icon-btn hidden shrink-0 text-lg font-bold sm:flex"
          >
            →
          </button>
        </div>

        {/* Mobile controls */}
        <div className="mt-6 flex items-center justify-center gap-4 sm:hidden">
          <button onClick={prev} className="icon-btn text-lg font-bold">
            ←
          </button>
          <button onClick={next} className="icon-btn text-lg font-bold">
            →
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <footer className="flex flex-wrap items-center justify-center gap-2.5 px-6 pb-10">
        {round.images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to question ${i + 1}`}
            style={{
              background: DOT_COLORS[i % DOT_COLORS.length],
              opacity: i === index ? 1 : 0.35,
            }}
            className={`h-3.5 rounded-full border-2 border-[#141311] transition-all ${
              i === index ? "w-8" : "w-3.5"
            }`}
          />
        ))}
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
}
