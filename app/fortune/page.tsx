import "./fortune.css";
import type { Metadata } from "next";
import { FortuneApp } from "@/components/fortune/Fortune";

export const metadata: Metadata = {
  title: "Lab. Fortune — KAWAKAMI Lab.",
  description: "今日の運勢とおすすめの育成ウマ娘を占います。",
};

export default function FortunePage() {
  return <FortuneApp />;
}
