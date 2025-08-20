// types/globals.d.ts
export {};

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTimeline: (
          options: {
            sourceType: string;
            screenName: string;
          },
          element: HTMLElement,
          customization?: {
            width?: number | string;
            height?: number | string;
            theme?: "light" | "dark";
            chrome?: string;
          },
        ) => Promise<HTMLElement>;
        load?: (element?: HTMLElement) => void;
      };
    };
  }
}
