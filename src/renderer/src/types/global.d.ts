export { };

declare global {
  interface Window {

    clipboardAPI: {
      getHistory: () => Promise<any[]>;
      onUpdate: (callback: (data: any[]) => void) => void;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}
interface ClipboardItem {
  id: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'url' | 'code';
}
