// types/globals.d.ts
interface Window {
  twttr?: {
    widgets: {
      createTimeline: (options: any, element: HTMLElement) => Promise<any>;
      load?: (element?: HTMLElement) => void; // 追加
    };
  };
}
