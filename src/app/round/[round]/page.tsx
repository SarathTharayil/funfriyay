import { notFound } from "next/navigation";
import { getRound } from "@/lib/rounds";
import RoundViewer from "./RoundViewer";
import QuizViewer from "./QuizViewer";

export default async function RoundPage({
  params,
}: {
  params: Promise<{ round: string }>;
}) {
  const { round } = await params;
  const data = getRound(round);

  if (!data) notFound();

  if (data.type === "quiz") {
    return <QuizViewer round={data} />;
  }

  return <RoundViewer round={data} />;
}
