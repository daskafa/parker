"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { adminDelete, adminGet, adminPost } from "@/lib/adminApi";
import type { PaginatedData, Subscriber } from "@/lib/adminTypes";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DetailModal } from "@/components/admin/DetailModal";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { EyeIcon, SendIcon, TrashIcon } from "@/components/admin/icons";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const DATE_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function SubscribersPage() {
  const [data, setData] = useState<PaginatedData<Subscriber> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Subscriber | null>(null);

  const direction = sorting[0]?.desc === false ? "asc" : "desc";

  const load = useCallback(async () => {
    setIsLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      direction,
    });
    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    }

    const result = await adminGet<PaginatedData<Subscriber>>(`/subscribers?${params.toString()}`);

    if (result.success) {
      setData(result.data);
    }

    setIsLoading(false);
  }, [page, debouncedSearch, direction]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, direction]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount'ta ve filtre degisince veri cekme deseni
    load();
  }, [load]);

  async function handleDelete(subscriber: Subscriber) {
    if (!window.confirm(`${subscriber.email} kaydını silmek istediğinize emin misiniz?`)) {
      return;
    }

    setBusyId(subscriber.id);
    const result = await adminDelete(`/subscribers/${subscriber.id}`);
    setBusyId(null);

    if (result.success) {
      setFeedback(result.message);
      setSelected(null);
      load();
    }
  }

  async function handleResend(subscriber: Subscriber) {
    setBusyId(subscriber.id);
    const result = await adminPost(`/subscribers/${subscriber.id}/resend`, {});
    setBusyId(null);
    setFeedback(result.message);
  }

  const columns = useMemo<ColumnDef<Subscriber, unknown>[]>(
    () => [
      {
        accessorKey: "email",
        header: "E-posta",
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: "Kayıt Tarihi",
        cell: ({ getValue }) => (
          <span className="text-zinc-400">{DATE_FORMATTER.format(new Date(String(getValue())))}</span>
        ),
      },
      {
        accessorKey: "hasAppointment",
        header: "Randevu Durumu",
        enableSorting: false,
        cell: ({ row }) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              row.original.hasAppointment
                ? "bg-[#14F195]/10 text-[#14F195]"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {row.original.hasAppointment ? "Oluşturuldu" : "Oluşturulmadı"}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="block text-right">İşlemler</span>,
        enableSorting: false,
        cell: ({ row }) => {
          const subscriber = row.original;

          return (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelected(subscriber)}
                title="Detay"
                aria-label="Detay"
                className="cursor-pointer rounded-md p-1.5 text-sky-400 transition hover:bg-sky-500/10 hover:text-sky-300"
              >
                <EyeIcon />
              </button>
              {!subscriber.hasAppointment && (
                <button
                  type="button"
                  disabled={busyId === subscriber.id}
                  onClick={() => handleResend(subscriber)}
                  title="Yeniden Gönder"
                  aria-label="Yeniden Gönder"
                  className="cursor-pointer rounded-md p-1.5 text-[#14F195] transition hover:bg-[#14F195]/10 hover:text-[#6dffc0] disabled:opacity-50"
                >
                  <SendIcon />
                </button>
              )}
              <button
                type="button"
                disabled={busyId === subscriber.id}
                onClick={() => handleDelete(subscriber)}
                title="Sil"
                aria-label="Sil"
                className="cursor-pointer rounded-md p-1.5 text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
              >
                <TrashIcon />
              </button>
            </div>
          );
        },
      },
    ],
    [busyId],
  );

  return (
    <div>
      <PageHeader
        title="Kayıtlı E-postalar"
        description="Landing page üzerinden toplanan e-posta kayıtları."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="E-posta ara..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-[#18151c] px-4 py-2 text-sm text-white outline-none focus:border-zinc-400 sm:w-72"
        />
      </div>

      {feedback && <p className="mb-4 text-sm text-[#14F195]">{feedback}</p>}

      <AdminDataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="Kayıt bulunamadı."
        sorting={sorting}
        onSortingChange={setSorting}
        manualSorting
      />

      {data && <Pagination meta={data.meta} onPageChange={setPage} />}

      {selected && (
        <DetailModal
          title="Kayıt Detayı"
          onClose={() => setSelected(null)}
          fields={[
            { label: "E-posta", value: selected.email },
            { label: "Kayıt Tarihi", value: DATE_FORMATTER.format(new Date(selected.createdAt)) },
            {
              label: "Randevu Durumu",
              value: selected.hasAppointment ? "Oluşturuldu" : "Oluşturulmadı",
            },
          ]}
        />
      )}
    </div>
  );
}
