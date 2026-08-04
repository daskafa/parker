"use client";

import { useEffect, useState } from "react";

/**
 * Input degerini gecikmeli yansitir; arama gibi sik tetiklenen
 * isteklerde debounce icin kullanilir.
 */
export function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debounced;
}
