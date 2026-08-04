import type { ReactNode } from "react";

/**
 * Tum section'larda tutarli hizalama saglamak icin ortak container.
 * Her section bu bileseni AYNI sekilde kullanmali (once max-w + mx-auto,
 * sonra padding) ki logo, baslik gibi elemanlar dikey olarak hep ayni
 * sol/sag kenara hizalansin.
 */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}
