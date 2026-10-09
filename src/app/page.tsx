import Link from "next/link";
import { getRounds } from "@/lib/rounds";
import SiteNav from "@/components/SiteNav";
import RoundCard from "@/components/RoundCard";

export const dynamic = "force-dynamic";

const TAG_COLORS = ["bg-[#ffd93f]", "bg-[#ff6fae]", "bg-[#5ce0b8]", "bg-[#9dc1ff]"];

export default function Home() {
  const rounds = getRounds();

  return (
    <main className="flex-1">
      {/* Screen 1: full-viewport hero */}
      <section className="relative flex h-screen flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#ffd93f]/30 blur-3xl" />
          <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-[#ff6fae]/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#5ce0b8]/25 blur-3xl" />
          <div className="absolute bottom-10 right-1/4 h-56 w-56 rounded-full bg-[#9dc1ff]/25 blur-3xl" />
        </div>

        <SiteNav />

        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="font-hand text-2xl text-[#141311]/70">
            it&apos;s finally
          </span>

          <div className="relative mt-3">
            <span className="chip absolute -left-10 top-0 -rotate-6 rounded-full bg-[#ffd93f] px-3 py-1 text-[10px] font-semibold tracking-wide sm:-left-20">
              MADE FOR FRIDAYS
            </span>

            <h1 className="hard rounded-2xl border-dashed bg-white px-10 py-6 font-pixel text-5xl tracking-wide sm:text-7xl">
              FRIYAY
            </h1>

            <span className="chip absolute -right-10 bottom-0 rotate-6 rounded-full bg-[#5ce0b8] px-3 py-1 text-[10px] font-semibold tracking-wide sm:-right-20">
              {rounds.length || 0} ROUND{rounds.length === 1 ? "" : "S"} READY
            </span>
          </div>

          <h2 className="mt-8 text-2xl font-bold leading-snug sm:text-3xl">
            This one&apos;s been a long time coming.
            <br className="hidden sm:block" /> Here we go, let&apos;s play! 🎉
          </h2>

          <Link
            href="/play"
            className="hard hard-press mt-7 flex items-center gap-2 rounded-xl bg-[#141311] px-6 py-3 font-semibold text-[#f3f2ec]"
          >
            → START PLAYING
          </Link>
        </div>

        <a
          href="#rounds"
          className="font-hand flex shrink-0 items-center justify-center gap-1 pb-6 text-lg text-[#141311]/50 hover:text-[#141311]"
        >
          see tonight&apos;s rounds ↓
        </a>
      </section>

      <div className="mx-auto max-w-5xl border-t-2 border-dashed border-[#141311]/20" />

      {/* Screen 2: rounds */}
      <section id="rounds" className="mx-auto max-w-5xl px-6 py-16">
        {rounds.length === 0 ? (
          <div className="hard rounded-2xl border-dashed bg-white px-8 py-16 text-center">
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
          <div className="flex flex-col gap-8">
            {rounds.map((round, i) => (
              <RoundCard key={round.slug} round={round} index={i} className="hard-press" />
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-5xl px-6 pb-20">
        <div className="flex justify-center">
          <span className="chip rounded-md bg-white px-4 py-1.5 font-semibold">
            what&apos;s up
          </span>
        </div>

        <div className="mt-10 grid items-center gap-10 sm:grid-cols-[200px_1fr]">
          <div className="hard-sm relative mx-auto -rotate-2 bg-[#ffd93f] p-3">
            <div className="flex h-36 w-36 items-center justify-center text-5xl">
              🎉
            </div>
          </div>

          <div>
            <p className="text-lg leading-relaxed text-[#141311]/80">
              A weekly game night, projected on the big screen — rebus
              puzzles, trivia, and the occasional unfair question. No
              prizes, just bragging rights.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {(rounds.length ? rounds : [{ slug: "soon", title: "More Soon" }]).map(
                (r, i) => (
                  <span
                    key={r.slug}
                    className={`chip rounded-full px-3 py-1 ${TAG_COLORS[i % TAG_COLORS.length]}`}
                  >
                    {r.title}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="pb-10 text-center">
        <span className="font-hand text-lg text-[#141311]/45">
          see you Friday ✌️
        </span>
      </footer>
    </main>
  );
}
