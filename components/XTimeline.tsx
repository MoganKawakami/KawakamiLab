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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let mounted = true;

    const resetState = () => {
      if (mounted) {
        setIsLoading(true);
        setError(null);
      }
    };

    const handleError = (errorMessage: string) => {
      if (mounted) {
        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => {
            if (mounted) {
              resetState();
              loadWidget();
            }
          }, 2000);
        } else {
          setError(errorMessage);
          setIsLoading(false);
        }
      }
    };

    const loadWidget = () => {
      if (!mounted) return;

      const existingScript = document.querySelector(
        'script[src*="platform.twitter.com"]',
      );

      if (!window.twttr && !existingScript) {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.charset = "utf-8";
        script.onload = () => {
          setTimeout(() => {
            if (mounted) createTimeline();
          }, 500);
        };
        script.onerror = () => {
          handleError("スクリプトの読み込みに失敗しました");
        };
        document.head.appendChild(script);
      } else if (window.twttr) {
        createTimeline();
      } else {
        const checkTwitter = setInterval(() => {
          if (window.twttr) {
            clearInterval(checkTwitter);
            createTimeline();
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkTwitter);
          if (!window.twttr) {
            handleError("Twitter ウィジェットが初期化されませんでした");
          }
        }, 5000);
      }
    };

    const createTimeline = () => {
      if (
        !mounted ||
        !containerRef.current ||
        !window.twttr?.widgets?.createTimeline
      ) {
        handleError("Twitter ウィジェットが利用できません");
        return;
      }

      try {
        containerRef.current.innerHTML = "";

        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile =
          /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
            userAgent,
          ) || window.innerWidth <= 768;
        const actualWidth = isMobile
          ? Math.min(width, window.innerWidth - 40)
          : width;

        window.twttr.widgets
          .createTimeline(
            {
              sourceType: "profile",
              screenName: username,
            },
            containerRef.current,
            {
              width: actualWidth,
              height: height,
              theme: "light",
              chrome: "noheader nofooter noborders transparent",
            },
          )
          .then(() => {
            if (mounted) {
              setIsLoading(false);
              setError(null);
            }
          })
          .catch(() => {
            handleError("タイムラインの作成に失敗しました");
          });

        timeoutId = setTimeout(() => {
          if (mounted && isLoading) {
            handleError("タイムラインの読み込みがタイムアウトしました");
          }
        }, 15000);
      } catch (err) {
        handleError("タイムラインの設定中にエラーが発生しました");
      }
    };

    resetState();
    const initialDelay = setTimeout(() => {
      if (mounted) loadWidget();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(initialDelay);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [username, width, height, retryCount]);

  // リサイズ時の再読み込み
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && window.twttr?.widgets?.createTimeline) {
        const isMobile = window.innerWidth <= 768;
        const actualWidth = isMobile
          ? Math.min(width, window.innerWidth - 32)
          : width;

        containerRef.current.innerHTML = "";
        window.twttr.widgets.createTimeline(
          {
            sourceType: "profile",
            screenName: username,
          },
          containerRef.current,
          {
            width: actualWidth.toString(),
            height: height.toString(),
            theme: "light",
            chrome: "noheader nofooter noborders transparent",
          },
        );
      }
    };

    const debouncedResize = debounce(handleResize, 300);
    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [username, width, height]);

  if (error) {
    return (
      <div
        className={`my-4 ${className} flex items-center justify-center bg-gray-100 rounded-lg`}
        style={{ width: width, height: height }}
      >
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2">
            タイムラインの読み込みに失敗しました
          </p>
          <a
            href={`https://twitter.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            @{username} をXで見る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`my-4 ${className} relative`}>
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10"
          style={{ width: width, height: height }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">タイムラインを読み込み中...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}

// デバウンス関数
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
