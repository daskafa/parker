import type { PaginatedMeta } from "@/lib/adminTypes";

type PaginationProps = {
  meta: PaginatedMeta;
  onPageChange: (page: number) => void;
};

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (meta.lastPage <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
      <p>
        Toplam <span className="text-white">{meta.total}</span> kayıt — Sayfa {meta.currentPage} / {meta.lastPage}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={meta.currentPage <= 1}
          onClick={() => onPageChange(meta.currentPage - 1)}
          className="rounded-lg border border-zinc-700 px-3 py-1.5 font-medium transition hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Önceki
        </button>
        <button
          type="button"
          disabled={meta.currentPage >= meta.lastPage}
          onClick={() => onPageChange(meta.currentPage + 1)}
          className="rounded-lg border border-zinc-700 px-3 py-1.5 font-medium transition hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}
