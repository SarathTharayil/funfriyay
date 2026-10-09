import Link from "next/link";
import type { CSSProperties } from "react";
import type { RoundSummary } from "@/lib/rounds";

export const PALETTE = [
  { bg: "bg-[#141311]", text: "text-[#f3f2ec]", tab: "bg-[#3b5bfd]" },
  { bg: "bg-[#ffd93f]", text: "text-[#141311]", tab: "bg-[#141311] text-[#ffd93f]" },
  { bg: "bg-[#ff6fae]", text: "text-[#141311]", tab: "bg-[#141311] text-[#ff6fae]" },
  { bg: "bg-[#5ce0b8]", text: "text-[#141311]", tab: "bg-[#141311] text-[#5ce0b8]" },
];

export const THUMB_COLORS = ["#ffd93f", "#ff6fae", "#5ce0b8", "#9dc1ff"];

function typeLabel(round: RoundSummary) {
  const kind =
    round.type === "quiz"
      ? "🎯 quiz"
      : round.type === "truefalse"
      ? "🙋 true or false"
      : "🧩 picture round";
  const unit =
    round.type === "truefalse"
      ? round.count === 1
        ? "statement"
        : "statements"
      : round.count === 1
      ? "question"
      : "questions";
  return `${kind} · ${round.count} ${unit}`;
}

export default function RoundCard({
  round,
  index,
  className = "",
  style,
}: {
  round: RoundSummary;
  index: number;
  className?: string;
  style?: CSSProperties;
}) {
  const palette = PALETTE[index % PALETTE.length];

  return (
    <Link
      href={`/round/${round.slug}`}
      className={`hard relative block overflow-hidden rounded-2xl ${palette.bg} ${palette.text} ${className}`}
      style={style}
    >
      <span
        className={`hard-sm absolute -top-2 left-6 rounded-md px-3 py-1 text-xs font-bold tracking-wide ${palette.tab}`}
      >
        ROUND {String(index + 1).padStart(2, "0")}
      </span>

      <div className="grid items-center gap-6 px-6 pb-6 pt-10 sm:grid-cols-[1fr_200px] sm:px-10 sm:pt-12">
        <div className="flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
            {typeLabel(round)}
          </span>
          <h3 className="mt-2 font-pixel text-3xl sm:text-4xl">{round.title}</h3>
          <span className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-bold underline underline-offset-4">
            PLAY ROUND →
          </span>
        </div>

        <div
          className="hard-sm relative mx-auto flex h-28 w-full max-w-[200px] items-center justify-center overflow-hidden rounded-lg"
          style={{ background: THUMB_COLORS[index % THUMB_COLORS.length] }}
        >
          <span className="font-pixel text-5xl text-[#141311]">?</span>
        </div>
      </div>
    </Link>
  );
}
