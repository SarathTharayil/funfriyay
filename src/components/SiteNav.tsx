import Link from "next/link";

export default function SiteNav({
  eyebrow,
  title,
  badge,
  backHref,
}: {
  eyebrow?: string;
  title?: string;
  badge?: string;
  backHref?: string;
}) {
  return (
    <header className="mx-auto flex w-full max-w-5xl shrink-0 items-center justify-between px-6 py-5">
      <Link
        href={backHref ?? "/"}
        className="chip hard-press flex items-center gap-1.5 rounded-full bg-[#ffd93f] px-4 py-1.5 text-sm font-semibold"
      >
        {backHref ? "← ALL ROUNDS" : "● FRIYAY"}
      </Link>

      {title && (
        <div className="flex flex-col items-center">
          {eyebrow && (
            <span className="font-hand -rotate-1 text-base leading-none text-[#141311]/55">
              {eyebrow}
            </span>
          )}
          <h1 className="font-pixel text-xl sm:text-2xl">{title}</h1>
        </div>
      )}

      {badge ? (
        <span className="chip flex min-w-[4.5rem] items-center justify-center rounded-full bg-[#9dc1ff] px-4 py-1.5 font-pixel text-sm">
          {badge}
        </span>
      ) : (
        <a
          href="#rounds"
          className="chip hidden rounded-full bg-white px-4 py-1.5 text-sm font-semibold sm:block"
        >
          ▤ ROUNDS
        </a>
      )}
    </header>
  );
}
