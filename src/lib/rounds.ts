import fs from "fs";
import path from "path";

export const ROUNDS_DIR = path.join(process.cwd(), "rounds");

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
]);

const QUIZ_FILE = "questions.json";

export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number; // index into options
};

export type RoundSummary = {
  slug: string;
  title: string;
  type: "image" | "quiz";
  count: number;
  cover: string | null;
};

export type ImageRoundDetail = RoundSummary & {
  type: "image";
  images: string[]; // filenames, sorted
};

export type QuizRoundDetail = RoundSummary & {
  type: "quiz";
  questions: QuizQuestion[];
};

export type RoundDetail = ImageRoundDetail | QuizRoundDetail;

function humanize(slug: string): string {
  return slug
    .replace(/^\d+[-_]+/, "") // strip a leading order prefix like "1-"
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function listImageFiles(dir: string): string[] {
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort(naturalSort);
}

function readQuizFile(dir: string): QuizQuestion[] | null {
  const file = path.join(dir, QUIZ_FILE);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
    if (!Array.isArray(raw)) return null;
    return raw.filter(
      (q): q is QuizQuestion =>
        q &&
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length > 0 &&
        typeof q.correct === "number"
    );
  } catch {
    return null;
  }
}

export function getRounds(): RoundSummary[] {
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(ROUNDS_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  return entries
    .filter((e) => e.isDirectory())
    .map((e): RoundSummary | null => {
      const dir = path.join(ROUNDS_DIR, e.name);
      const quiz = readQuizFile(dir);
      if (quiz) {
        return {
          slug: e.name,
          title: humanize(e.name),
          type: "quiz",
          count: quiz.length,
          cover: null,
        };
      }
      const images = listImageFiles(dir);
      if (images.length === 0) return null;
      return {
        slug: e.name,
        title: humanize(e.name),
        type: "image",
        count: images.length,
        cover: images[0] ?? null,
      };
    })
    .filter((round): round is RoundSummary => round !== null && round.count > 0)
    .sort((a, b) => naturalSort(a.slug, b.slug));
}

export function getRound(slug: string): RoundDetail | null {
  const safeSlug = path.basename(slug);
  const dir = path.join(ROUNDS_DIR, safeSlug);

  const quiz = readQuizFile(dir);
  if (quiz && quiz.length > 0) {
    return {
      slug: safeSlug,
      title: humanize(safeSlug),
      type: "quiz",
      count: quiz.length,
      cover: null,
      questions: quiz,
    };
  }

  const images = listImageFiles(dir);
  if (images.length === 0) return null;

  return {
    slug: safeSlug,
    title: humanize(safeSlug),
    type: "image",
    count: images.length,
    cover: images[0] ?? null,
    images,
  };
}
