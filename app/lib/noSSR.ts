import dynamic from "next/dynamic";
import { ComponentType } from "react";

/**
 * Helper untuk load component tanpa SSR
 * Cocok untuk:
 * - Leaflet
 * - Chart.js
 * - Library berbasis window / DOM
 */
export function noSSR<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
) {
  return dynamic(importFunc, {
    ssr: false,
  });
}
