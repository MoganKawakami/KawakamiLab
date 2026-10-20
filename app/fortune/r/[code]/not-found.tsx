/* An unknown or malformed share code: answer 404 and offer today's fortune right here,
   instead of redirecting (a shared link that redirects looks suspicious to link scanners). */
import "../../fortune.css";
import "../../../styles/crystal.css";
import { FortuneApp } from "@/components/fortune/Fortune";

export default function SharedFortuneNotFound() {
  return <FortuneApp />;
}
