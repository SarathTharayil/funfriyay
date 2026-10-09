import type { CSSProperties } from "react";
import { getRounds } from "@/lib/rounds";
import SiteNav from "@/components/SiteNav";
import RoundCard from "@/components/RoundCard";

export const dynamic = "force-dynamic";

// A bit of hand-tossed variety per card position in the deck.
const ROTATIONS = [-3, 2.5, -2, 3, -1.5, 2];
const SHIFTS = [-10, 14, -16, 10, -8, 12];

export default function PlayPage() {
  const rounds = getRounds();

  return (
    <main className="flex min-h-screen flex-1 flex-col">
      <SiteNav eyebrow="pick your round" title="Let's Play" backHref="/" />

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        {rounds.length === 0 ? (
          <div className="hard mx-auto max-w-md rounded-2xl border-dashed bg-white px-8 py-16 text-center">
            <p className="font-pixel text-xl">NO ROUNDS YET</p>
            <p className="mt-3 text-sm text-[#141311]/70">
              Drop a folder of images into{" "}
              <code className="rounded bg-[#141311]/5 px-1.5 py-0.5">
                /rounds
              </code>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <>
            <p className="font-hand mb-10 text-xl text-[#141311]/50">
              hover a card to peek · click to play
            </p>

            <div className="mx-auto flex w-full max-w-2xl flex-col items-stretch">
              {rounds.map((round, i) => (
                <RoundCard
                  key={round.slug}
                  round={round}
                  index={i}
                  className="stack-card"
                  style={
                    {
                      marginTop: i === 0 ? 0 : "-140px",
                      zIndex: i + 1,
                      "--rot": `${ROTATIONS[i % ROTATIONS.length]}deg`,
                      "--sx": `${SHIFTS[i % SHIFTS.length]}px`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
