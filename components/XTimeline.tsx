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
  const [error, setError] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const loadWidget = () => {
      if (!window.twttr) {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = () => {
          // スクリプト読み込み後、少し待ってからウィジェットを作成
          setTimeout(createTimeline, 100);
        };
        script.onerror = () => {
          setError(true);
          setIsLoading(false);
        };
        document.body.appendChild(script);
      } else {
        createTimeline();
      }
    };

    const createTimeline = () => {
      if (containerRef.current && window.twttr?.widgets?.createTimeline) {
        containerRef.current.innerHTML = "";
        
        // モバイルデバイスの検出
        const isMobile = window.innerWidth <= 768;
        const actualWidth = isMobile ? Math.min(width, window.innerWidth - 32) : width;
        
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
          }
        ).then(() => {
          setIsLoading(false);
        }).catch(() => {
          setError(true);
          setIsLoading(false);
        });
        
        // タイムアウト設定（10秒後にエラー表示）
        timeoutId = setTimeout(() => {
          if (isLoading) {
            setError(true);
            setIsLoading(false);
          }
        }, 10000);
      }
    };

    // 少し遅延させて実行（DOMが完全に準備されるのを待つ）
    const delayedLoad = setTimeout(loadWidget, 500);

    return () => {
      clearTimeout(delayedLoad);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [username, width, height, isLoading]);

  // リサイズ時の再読み込み
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && window.twttr?.widgets?.createTimeline) {
        const isMobile = window.innerWidth <= 768;
        const actualWidth = isMobile ? Math.min(width, window.innerWidth - 32) : width;
        
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
          }
        );
      }
    };

    const debouncedResize = debounce(handleResize, 300);
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [username, width, height]);

  if (error) {
    return (
      <div className={`my-4 ${className} flex items-center justify-center bg-gray-100 rounded-lg`} 
           style={{ width: width, height: height }}>
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2">タイムラインの読み込みに失敗しました</p>
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
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10"
             style={{ width: width, height: height }}>
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
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}