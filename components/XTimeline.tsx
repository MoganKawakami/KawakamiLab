"use client";

import { useEffect, useRef } from "react";

interface XTimelineProps {
  username: string;
  width?: string | number; // string も許可
  height?: number;
  className?: string;
}

export default function XTimeline({
  username,
  width = "100%", // ← デフォルトでレスポンシブ
  height = 600,
  className = "",
}: XTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadWidget = () => {
      if (!window.twttr) {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = createTimeline;
        document.body.appendChild(script);
      } else {
        createTimeline();
      }
    };

    const createTimeline = () => {
      if (containerRef.current && window.twttr?.widgets?.createTimeline) {
        containerRef.current.innerHTML = "";
        window.twttr.widgets.createTimeline(
          {
            sourceType: "profile",
            screenName: username,
          },
          containerRef.current,
          {
            width: width.toString(), // ← "100%" も通せる
            height,
            theme: "light",
            chrome: "noheader nofooter noborders transparent",
          },
        );
      }
    };

    loadWidget();
  }, [username, width, height]);

  return <div ref={containerRef} className={`my-4 ${className}`} />;
}
