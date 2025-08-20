"use client";

import { useEffect } from "react";

interface XTimelineProps {
  username: string; // 表示したいXアカウントのユーザー名
  width?: number | string;
  height?: number | string;
}

export default function XTimeline({
  username,
  width = "400",
  height = "600",
}: XTimelineProps) {
  useEffect(() => {
    // スクリプトがすでに読み込まれていない場合のみ追加
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // 既存スクリプトがある場合はリロード
      window.twttr?.widgets?.load?.(
        document.getElementById("timeline-container")!,
      );
    }
  }, []);

  return (
    <div className="my-4">
      <a
        className="twitter-timeline"
        data-width={width}
        data-height={height}
        data-theme="light"
        href={`https://twitter.com/${username}`}
      >
        Tweets by @{username}
      </a>
    </div>
  );
}
