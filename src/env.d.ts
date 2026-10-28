/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  dailyPixel?: (action: string, value: unknown, metadata?: object) => void;
  gtag?: (...args: unknown[]) => void;
}
