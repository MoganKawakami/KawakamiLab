import "../../fortune.css";
import "../../../styles/crystal.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SharedFortune } from "@/components/fortune/Fortune";
import { decodeFortune } from "@/lib/fortune-data";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = decodeFortune((await params).code);
  if (!r) return {};
  return {
    title: `今日の運勢は「${r.rank}」 | KAWAKAMI Lab.`,
    description: `育成ウマ娘：${r.uma} / おすすめシナリオ：${r.scenario}`,
    openGraph: { type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SharedFortunePage({ params }: Props) {
  const r = decodeFortune((await params).code);
  if (!r) notFound();
  return <SharedFortune res={r} />;
}
