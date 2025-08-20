"use client";

import { useEffect, useRef } from "react";

interface XTimelineProps {
  username: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function XTimeline({
  username,
  width = 400,
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
            width,
            height,
            theme: "light",
            chrome: "noheader nofooter noborders noscrollbar transparent",
          },
        );
      }
    };

    loadWidget();
  }, [username, width, height]);

  return <div ref={containerRef} className={`my-4 ${className}`} />;
}
