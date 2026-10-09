"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { QuizRoundDetail } from "@/lib/rounds";
import SiteNav from "@/components/SiteNav";

const OPTION_COLORS = ["#ffd93f", "#ff6fae", "#5ce0b8", "#9dc1ff"];
const LETTERS = ["A", "B", "C", "D"];

export default function QuizViewer({ round }: { round: QuizRoundDetail }) {
  const total = round.questions.length;
  const [index, setIndex] = useState(0);
  const [votes, setVotes] = useState<number[]>(() =>
    Array(round.questions[0]?.options.length ?? 4).fill(0)
  );
  const [revealed, setRevealed] = useState(false);

  const question = round.questions[index];
  const totalVotes = votes.reduce((a, b) => a + b, 0);
  const finished = index >= total;

  const resetFor = useCallback((qIndex: number) => {
    setVotes(Array(round.questions[qIndex]?.options.length ?? 4).fill(0));
    setRevealed(false);
  }, [round.questions]);

  const vote = useCallback(
    (optionIndex: number) => {
      if (revealed || finished) return;
      setVotes((v) => {
        const next = [...v];
        next[optionIndex] += 1;
        return next;
      });
    },
    [revealed, finished]
  );

  const undo = useCallback(
    (optionIndex: number) => {
      if (revealed || finished) return;
      setVotes((v) => {
        if (v[optionIndex] === 0) return v;
        const next = [...v];
        next[optionIndex] -= 1;
        return next;
      });
    },
    [revealed, finished]
  );

  const reveal = useCallback(() => setRevealed(true), []);

  const goNext = useCallback(() => {
    const nextIndex = index + 1;
    setIndex(nextIndex);
    resetFor(nextIndex);
  }, [index, resetFor]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (finished) return;
      const num = Number(e.key);
      if (num >= 1 && num <= (question?.options.length ?? 0)) vote(num - 1);
      if (e.key.toLowerCase() === "r") reveal();
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "n") {
        if (revealed) goNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question, vote, reveal, revealed, goNext, finished]);

  const percentages = useMemo(
    () =>
      votes.map((v) => (totalVotes === 0 ? 0 : Math.round((v / totalVotes) * 100))),
    [votes, totalVotes]
  );

  if (finished) {
    return (
      <main className="flex min-h-screen flex-1 flex-col">
        <SiteNav eyebrow="that's a wrap" title={round.title} backHref="/" />
        <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="hard rounded-2xl border-dashed bg-white px-10 py-6 font-pixel text-4xl">
            NICE ONE 🎉
          </span>
          <p className="mt-5 text-[#141311]/70">
            That was the last question in {round.title}.
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
        <div className="hard rounded-2xl bg-white px-6 py-8 sm:px-10 sm:py-10">
          <span className="chip inline-flex rounded-full bg-[#9dc1ff] px-3 py-1 font-pixel text-xs">
            Q{index + 1}
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">
            {question.question}
          </h2>

          <div className="mt-7 flex flex-col gap-3">
            {question.options.map((option, i) => {
              const isCorrect = i === question.correct;
              const showResult = revealed;
              const color = OPTION_COLORS[i % OPTION_COLORS.length];

              return (
                <button
                  key={i}
                  onClick={() => vote(i)}
                  disabled={revealed}
                  className={`hard-sm group relative w-full overflow-hidden rounded-xl bg-white px-5 py-4 text-left transition-all ${
                    revealed
                      ? isCorrect
                        ? "ring-2 ring-[#141311]"
                        : "opacity-50"
                      : "hard-press"
                  }`}
                >
                  <span
                    className="absolute inset-y-0 left-0 transition-all duration-500"
                    style={{
                      width: `${percentages[i]}%`,
                      background: color,
                      opacity: showResult && isCorrect ? 0.55 : 0.3,
                    }}
                  />

                  <span className="relative z-10 flex items-center gap-3">
                    <span
                      className="chip flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-pixel text-xs"
                      style={{ background: color }}
                    >
                      {LETTERS[i]}
                    </span>
                    <span className="flex-1 font-semibold">
                      {option}
                      {showResult && isCorrect && " ✓"}
                    </span>

                    {!revealed && votes[i] > 0 && (
                      <span
                        role="button"
                        aria-label={`Undo a vote for ${option}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          undo(i);
                        }}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#141311]/30 text-xs text-[#141311]/50 hover:border-[#141311] hover:text-[#141311]"
                      >
                        −
                      </span>
                    )}

                    <span className="font-pixel text-sm shrink-0">
                      {percentages[i]}%
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[#141311]/50">
            <span>{totalVotes} guess{totalVotes === 1 ? "" : "es"} so far</span>
            <span>tap an option per guess</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          {!revealed ? (
            <button
              onClick={reveal}
              className="hard hard-press flex items-center gap-2 rounded-xl bg-[#141311] px-7 py-3 font-semibold text-[#f3f2ec]"
            >
              ▸ REVEAL ANSWER
            </button>
          ) : (
            <button
              onClick={goNext}
              className="hard hard-press flex items-center gap-2 rounded-xl bg-[#141311] px-7 py-3 font-semibold text-[#f3f2ec]"
            >
              {index + 1 === total ? "FINISH ▸" : "NEXT QUESTION ▸"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
