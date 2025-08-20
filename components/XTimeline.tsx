// "use client";

// import { useEffect, useRef, useState } from "react";

// interface XTimelineProps {
//   username: string;
//   width?: number;
//   height?: number;
//   className?: string;
// }

// export default function XTimeline({
//   username,
//   width = 350,
//   height = 600,
//   className = "",
// }: XTimelineProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isMobile, setIsMobile] = useState(false);

//   // ブラウザマウント後にモバイル判定
//   useEffect(() => {
//     const userAgent = navigator.userAgent.toLowerCase();
//     const mobile =
//       /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
//         userAgent,
//       ) || window.innerWidth <= 768;
//     setIsMobile(mobile);
//   }, []);

//   useEffect(() => {
//     if (isMobile) return; // モバイルは iframe に切り替え

//     let mounted = true;

//     const createTimeline = () => {
//       if (!mounted || !containerRef.current) return;

//       const options = {
//         sourceType: "profile",
//         screenName: username,
//       };

//       const settings = {
//         width,
//         height,
//         theme: "light" as "light" | "dark",
//         chrome: "noheader nofooter noborders transparent",
//       };

//       if (window.twttr?.widgets?.createTimeline) {
//         window.twttr.widgets.createTimeline(
//           options,
//           containerRef.current!,
//           settings,
//         );
//       } else {
//         const script = document.createElement("script");
//         script.src = "https://platform.twitter.com/widgets.js";
//         script.async = true;
//         script.onload = () => {
//           if (mounted && window.twttr?.widgets?.createTimeline) {
//             window.twttr.widgets.createTimeline(
//               options,
//               containerRef.current!,
//               settings,
//             );
//           }
//         };
//         document.head.appendChild(script);
//       }
//     };

//     createTimeline();

//     return () => {
//       mounted = false;
//     };
//   }, [isMobile, username, width, height]);

//   return (
//     <div className={`my-4 ${className}`}>
//       {isMobile ? (
//         <iframe
//   src={`https://twitter.com/${username}?ref_src=twsrc%5Etfw`}
//   width={width}
//   height={height}
//   style={{ border: "none", overflow: "hidden" }}
// />
//       ) : (
//         <div ref={containerRef}></div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";

interface XTimelineProps {
  username: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function XTimeline({
  username,
  width = 350,
  height = 600,
  className = "",
}: XTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ブラウザマウント後にモバイル判定
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobile =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
        userAgent,
      ) || window.innerWidth <= 768;
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    let mounted = true;

    const createTimeline = () => {
      if (!mounted || !containerRef.current) return;

      const options = {
        sourceType: "profile",
        screenName: username,
      };

      const settings = {
        width,
        height,
        theme: "light" as "light" | "dark",
        chrome: "noheader nofooter noborders transparent",
      };

      if (window.twttr?.widgets?.createTimeline) {
        window.twttr.widgets.createTimeline(
          options,
          containerRef.current!,
          settings,
        );
      } else {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = () => {
          if (mounted && window.twttr?.widgets?.createTimeline) {
            window.twttr.widgets.createTimeline(
              options,
              containerRef.current!,
              settings,
            );
          }
        };
        document.head.appendChild(script);
      }
    };

    createTimeline();

    return () => {
      mounted = false;
    };
  }, [username, width, height]);

  return (
    <div className={`my-4 ${className}`}>
      <div ref={containerRef}></div>
    </div>
  );
}
