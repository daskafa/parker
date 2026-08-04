"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { adminDelete, adminGet, adminPatch } from "@/lib/adminApi";
import type { Appointment, AppointmentStatus, PaginatedData } from "@/lib/adminTypes";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DateFilterInput } from "@/components/admin/DateFilterInput";
import { DetailModal } from "@/components/admin/DetailModal";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { EyeIcon, TrashIcon } from "@/components/admin/icons";

const DATE_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: "pending", label: "Bekliyor" },
  { value: "confirmed", label: "Onaylandı" },
  { value: "cancelled", label: "İptal" },
];

const STATUS_BADGE: Record<AppointmentStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-[#14F195]/10 text-[#14F195]",
  cancelled: "bg-red-500/10 text-red-400",
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "Bekliyor",
  confirmed: "Onaylandı",
  cancelled: "İptal",
};

export default function AppointmentsPage() {
  const [data, setData] = useState<PaginatedData<Appointment> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([{ id: "scheduledAt", desc: true }]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const direction = sorting[0]?.desc === false ? "asc" : "desc";

  const load = useCallback(async () => {
    setIsLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      direction,
    });
    if (statusFilter) {
      params.set("status", statusFilter);
    }
    if (fromDate) {
      params.set("from", fromDate);
    }
    if (toDate) {
      params.set("to", toDate);
    }

    const result = await adminGet<PaginatedData<Appointment>>(`/appointments?${params.toString()}`);

    if (result.success) {
      setData(result.data);
    }

    setIsLoading(false);
  }, [page, statusFilter, fromDate, toDate, direction]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, fromDate, toDate, direction]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount'ta ve filtre degisince veri cekme deseni
    load();
  }, [load]);

  async function handleStatusChange(appointment: Appointment, status: AppointmentStatus) {
    setBusyId(appointment.id);
    const result = await adminPatch(`/appointments/${appointment.id}`, { status });
    setBusyId(null);

    if (result.success) {
      setFeedback(result.message);
      if (selected?.id === appointment.id) {
        setSelected({ ...appointment, status, statusLabel: STATUS_LABEL[status] });
      }
      load();
    }
  }

  async function handleDelete(appointment: Appointment) {
    if (!window.confirm("Bu randevuyu silmek istediğinize emin misiniz?")) {
      return;
    }

    setBusyId(appointment.id);
    const result = await adminDelete(`/appointments/${appointment.id}`);
    setBusyId(null);

    if (result.success) {
      setFeedback(result.message);
      setSelected(null);
      load();
    }
  }

  const columns = useMemo<ColumnDef<Appointment, unknown>[]>(
    () => [
      {
        accessorKey: "subscriberEmail",
        header: "E-posta",
        enableSorting: false,
      },
      {
        accessorKey: "scheduledAt",
        header: "Randevu Tarihi",
        cell: ({ getValue }) => (
          <span className="text-zinc-400">{DATE_FORMATTER.format(new Date(String(getValue())))}</span>
        ),
      },
      {
        id: "customer",
        accessorFn: (row) => row.customer?.name ?? "",
        header: "İlgili Müşteri",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.customer ? (
            <span className="text-zinc-400">
              {row.original.customer.name}
              <span className="mt-0.5 block text-xs text-zinc-500">{row.original.customer.email}</span>
            </span>
          ) : (
            <span className="text-zinc-400">—</span>
          ),
      },
      {
        accessorKey: "status",
        header: "Durum",
        enableSorting: false,
        cell: ({ row }) => {
          const appointment = row.original;

          return (
            <select
              value={appointment.status}
              disabled={busyId === appointment.id}
              onChange={(event) => handleStatusChange(appointment, event.target.value as AppointmentStatus)}
              className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none disabled:opacity-50 ${STATUS_BADGE[appointment.status]}`}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-black text-white">
                  {option.label}
                </option>
              ))}
            </select>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Oluşturulma",
        enableSorting: false,
        cell: ({ getValue }) => (
          <span className="text-zinc-400">{DATE_FORMATTER.format(new Date(String(getValue())))}</span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="block text-right">İşlemler</span>,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSelected(row.original)}
              title="Detay"
              aria-label="Detay"
              className="cursor-pointer rounded-md p-1.5 text-sky-400 transition hover:bg-sky-500/10 hover:text-sky-300"
            >
              <EyeIcon />
            </button>
            <button
              type="button"
              disabled={busyId === row.original.id}
              onClick={() => handleDelete(row.original)}
              title="Sil"
              aria-label="Sil"
              className="cursor-pointer rounded-md p-1.5 text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
            >
              <TrashIcon />
            </button>
          </div>
        ),
      },
    ],
    [busyId],
  );

  return (
    <div>
      <PageHeader
        title="Randevular"
        description="Oluşturulan randevular. İlgili müşteri, bildirimin gönderildiği yetkiliyi gösterir."
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="w-full cursor-pointer rounded-lg border border-zinc-700 bg-[#18151c] px-4 py-2 text-sm text-white outline-none focus:border-zinc-400 sm:w-48"
        >
          <option value="">Tüm durumlar</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <DateFilterInput label="Başlangıç" value={fromDate} onChange={setFromDate} />
          <DateFilterInput label="Bitiş" value={toDate} onChange={setToDate} />
          {(fromDate || toDate) && (
            <button
              type="button"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              className="cursor-pointer text-xs font-semibold text-zinc-400 transition hover:text-white"
            >
              Tarihi temizle
            </button>
          )}
        </div>
      </div>

      {feedback && <p className="mb-4 text-sm text-[#14F195]">{feedback}</p>}

      <AdminDataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="Randevu bulunamadı."
        minWidthClassName="min-w-[900px]"
        sorting={sorting}
        onSortingChange={setSorting}
        manualSorting
      />

      {data && <Pagination meta={data.meta} onPageChange={setPage} />}

      {selected && (
        <DetailModal
          title="Randevu Detayı"
          onClose={() => setSelected(null)}
          fields={[
            { label: "E-posta", value: selected.subscriberEmail ?? "—" },
            {
              label: "Randevu Tarihi / Saati",
              value: DATE_FORMATTER.format(new Date(selected.scheduledAt)),
            },
            {
              label: "İlgili Müşteri",
              value: selected.customer
                ? `${selected.customer.name} (${selected.customer.email})`
                : "—",
            },
            { label: "Durum", value: STATUS_LABEL[selected.status] },
            {
              label: "Oluşturulma Tarihi",
              value: DATE_FORMATTER.format(new Date(selected.createdAt)),
            },
          ]}
        />
      )}
    </div>
  );
}
