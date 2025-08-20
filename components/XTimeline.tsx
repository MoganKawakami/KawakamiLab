"use client";

import { useEffect, useRef, useState } from "react";

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

  // ✅ SSR ではそのまま width/height を使い、CSR で更新
  const [responsiveWidth, setResponsiveWidth] = useState(String(width));
  const [responsiveHeight, setResponsiveHeight] = useState(String(height));

  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 640) {
        setResponsiveWidth(String(Math.min(screenWidth - 32, 350)));
        setResponsiveHeight("500");
      } else if (screenWidth < 1024) {
        setResponsiveWidth("300");
        setResponsiveHeight("700");
      } else {
        setResponsiveWidth(String(width));
        setResponsiveHeight(String(height));
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [width, height]);

  useEffect(() => {
    const loadTwitterWidgets = () => {
      if (!window.twttr) {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = () => {
          if (containerRef.current && window.twttr?.widgets?.load) {
            window.twttr.widgets.load(containerRef.current);
          }
        };
        document.body.appendChild(script);
      } else {
        if (containerRef.current && window.twttr?.widgets?.load) {
          window.twttr.widgets.load(containerRef.current);
        }
      }
    };

    const timer = setTimeout(loadTwitterWidgets, 100);
    return () => clearTimeout(timer);
  }, [username, responsiveWidth, responsiveHeight]);

  return (
    <div ref={containerRef} className={`my-4 ${className} w-full`}>
      <a
        className="twitter-timeline"
        data-width={responsiveWidth}
        data-height={responsiveHeight}
        data-theme="light"
        data-chrome="noheader nofooter noborders noscrollbar transparent"
        href={`https://twitter.com/${username}`}
      >
        Tweets by @{username}
      </a>
    </div>
  );
}
