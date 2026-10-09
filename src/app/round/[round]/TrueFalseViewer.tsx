"use client";

import { useCallback, useEffect, useState } from "react";
import type { TrueFalseRoundDetail } from "@/lib/rounds";
import SiteNav from "@/components/SiteNav";

export default function TrueFalseViewer({ round }: { round: TrueFalseRoundDetail }) {
  const total = round.statements.length;
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const statement = round.statements[index];
  const finished = index >= total;

  const reveal = useCallback(() => setRevealed(true), []);

  const goNext = useCallback(() => {
    setIndex((i) => i + 1);
    setRevealed(false);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (finished) return;
      if (e.key.toLowerCase() === "r") reveal();
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "n") {
        if (revealed) goNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reveal, revealed, goNext, finished]);

  if (finished) {
    return (
      <main className="flex min-h-screen flex-1 flex-col">
        <SiteNav eyebrow="that's a wrap" title={round.title} backHref="/" />
        <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="hard rounded-2xl border-dashed bg-white px-10 py-6 font-pixel text-4xl">
            LAST ONE STANDING? 🏆
          </span>
          <p className="mt-5 text-[#141311]/70">
            That was the last statement in {round.title}.
          </p>
          <a
            href="/"
            className="hard hard-press mt-7 flex items-center gap-2 rounded-xl bg-[#141311] px-6 py-3 font-semibold text-[#f3f2ec]"
          >
            ← BACK TO ROUNDS
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col">
      <SiteNav
        eyebrow="now playing"
        title={round.title}
        badge={`${index + 1}/${total}`}
        backHref="/"
      />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 pb-10">
        {/* Legend / how-to-play reminder */}
        <div className="mb-5 flex flex-col items-center gap-2">
          <div className="hard-sm mx-auto flex overflow-hidden rounded-full text-xs font-semibold">
            <span className="flex items-center gap-1.5 bg-[#5ce0b8] px-4 py-1.5">
              🙌 HEAD = TRUE
            </span>
            <span className="flex items-center gap-1.5 border-l-2 border-[#141311] bg-[#ff6fae] px-4 py-1.5">
              🙅 HIPS = FALSE
            </span>
          </div>
          <p className="font-hand text-lg text-[#141311]/50">
            wrong guess sits down · last one standing wins
          </p>
        </div>

        <div
          className={`hard rounded-2xl px-6 py-10 text-center transition-colors duration-300 sm:px-10 sm:py-14 ${
            revealed
              ? statement.answer
                ? "bg-[#5ce0b8]/15"
                : "bg-[#ff6fae]/15"
              : "bg-white"
          }`}
        >
          <span className="chip inline-flex rounded-full bg-[#9dc1ff] px-3 py-1 font-pixel text-xs">
            #{index + 1}
          </span>

          <h2 className="mt-6 text-2xl font-bold leading-snug sm:text-3xl">
            {statement.statement}
          </h2>

          {revealed && (
            <div className="mt-8 flex animate-[pop_0.3s_ease-out] flex-col items-center gap-4">
              <div className="hard-sm flex items-center gap-4 rounded-2xl bg-white px-6 py-4 text-left">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-bold"
                  style={{
                    background: statement.answer ? "#e4f9f1" : "#fde8f0",
                    color: statement.answer ? "#1f9d72" : "#d81b60",
                  }}
                >
                  {statement.answer ? "✓" : "✕"}
                </span>
                <div>
                  <div
                    className="font-pixel text-3xl sm:text-4xl"
                    style={{ color: statement.answer ? "#1f9d72" : "#d81b60" }}
                  >
                    {statement.answer ? "TRUE" : "FALSE"}
                  </div>
                  <div className="mt-0.5 text-xs font-bold uppercase tracking-wide text-[#141311]/50">
                    {statement.answer ? "🙌 heads stay standing" : "🤚 hips stay standing"}
                  </div>
                </div>
              </div>

              {statement.explanation && (
                <p className="font-hand max-w-md text-2xl text-[#141311]/70">
                  {statement.explanation}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          {!revealed ? (
            <button
              onClick={reveal}
              className="hard hard-press flex items-center gap-2 rounded-xl bg-[#141311] px-7 py-3 font-semibold text-[#f3f2ec]"
            >
              → REVEAL ANSWER
            </button>
          ) : (
            <button
              onClick={goNext}
              className="hard hard-press flex items-center gap-2 rounded-xl bg-[#141311] px-7 py-3 font-semibold text-[#f3f2ec]"
            >
              {index + 1 === total ? "FINISH →" : "NEXT STATEMENT →"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
