import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { ROUNDS_DIR } from "@/lib/rounds";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ round: string; file: string }> }
) {
  const { round, file } = await params;

  // Guard against path traversal: only allow plain filenames.
  const safeRound = path.basename(round);
  const safeFile = path.basename(file);

  const ext = path.extname(safeFile).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const filePath = path.join(ROUNDS_DIR, safeRound, safeFile);

  // Ensure the resolved path stays within ROUNDS_DIR.
  if (!filePath.startsWith(ROUNDS_DIR)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const data = fs.readFileSync(filePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
