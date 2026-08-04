"use client";

import { useRef } from "react";

const DATE_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

type DateFilterInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function DateFilterInput({ label, value, onChange }: DateFilterInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const input = inputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;

    if (!input) {
      return;
    }

    try {
      input.showPicker?.();
    } catch {
      input.focus();
    }
  }

  return (
    <label className="flex items-center gap-2 text-sm text-zinc-400">
      <span className="shrink-0">{label}</span>
      <div className="relative min-w-[140px]">
        <div className="pointer-events-none flex items-center rounded-lg border border-zinc-700 bg-[#18151c] px-3 py-2">
          <span className={`text-sm ${value ? "text-white" : "text-zinc-500"}`}>
            {value ? DATE_FORMATTER.format(new Date(`${value}T00:00:00`)) : "Seçiniz"}
          </span>
        </div>
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onClick={openPicker}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </label>
  );
}
