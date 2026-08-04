"use client";

type DetailField = {
  label: string;
  value: React.ReactNode;
};

type DetailModalProps = {
  title: string;
  fields: DetailField[];
  onClose: () => void;
};

export function DetailModal({ title, fields, onClose }: DetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-[#18151c] p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id="detail-modal-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm text-zinc-400 transition hover:text-white"
          >
            Kapat
          </button>
        </div>

        <dl className="space-y-4">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">{field.label}</dt>
              <dd className="mt-1 text-sm text-zinc-200">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
