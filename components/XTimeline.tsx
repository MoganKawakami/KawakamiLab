"use client";

import { useEffect, useRef } from "react";

interface XTimelineProps {
  username: string; // 表示したいXアカウントのユーザー名
  width?: number | string;
  height?: number | string;
  className?: string;
}

export default function XTimeline({
  username,
  width = "400",
  height = "1600",
  className = "",
}: XTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTwitterWidgets = () => {
      if (!window.twttr) {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = () => {
          // スクリプト読み込み完了後に初期化
          if (containerRef.current && window.twttr?.widgets?.load) {
            window.twttr.widgets.load(containerRef.current);
          }
        };
        document.body.appendChild(script);
      } else {
        // 既存スクリプトがある場合はリロード
        if (containerRef.current && window.twttr?.widgets?.load) {
          window.twttr.widgets.load(containerRef.current);
        }
      }
    };

    // 少し遅延させてから実行（DOM準備完了を確実にする）
    const timer = setTimeout(loadTwitterWidgets, 100);

    return () => clearTimeout(timer);
  }, [username]);

  // レスポンシブ対応の幅設定
  const getResponsiveWidth = () => {
    if (typeof window === "undefined") return width;

    const screenWidth = window.innerWidth;
    if (screenWidth < 640) {
      // sm未満
      return Math.min(screenWidth - 32, 350); // 画面幅-余白、最大350px
    } else if (screenWidth < 1024) {
      // lg未満
      return 300;
    }
    return width;
  };

  const getResponsiveHeight = () => {
    if (typeof window === "undefined") return height;

    const screenWidth = window.innerWidth;
    if (screenWidth < 640) {
      // sm未満
      return "500";
    } else if (screenWidth < 1024) {
      // lg未満
      return "700";
    }
    return height;
  };

  return (
    <div ref={containerRef} className={`my-4 ${className} w-full`}>
      <a
        className="twitter-timeline"
        data-width={getResponsiveWidth()}
        data-height={getResponsiveHeight()}
        data-theme="light"
        data-chrome="noheader nofooter noborders noscrollbar transparent"
        href={`https://twitter.com/${username}`}
      >
        Tweets by @{username}
      </a>
    </div>
  );
}
