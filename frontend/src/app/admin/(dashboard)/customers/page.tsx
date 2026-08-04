"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { adminDelete, adminGet, adminPost, adminPut } from "@/lib/adminApi";
import type { Customer, PaginatedData } from "@/lib/adminTypes";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { BellIcon, PencilIcon, TrashIcon } from "@/components/admin/icons";

type FormState = {
  id: number | null;
  name: string;
  email: string;
  isDefault: boolean;
};

const EMPTY_FORM: FormState = { id: null, name: "", email: "", isDefault: false };

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const defaultCustomer = customers.find((customer) => customer.isDefault) ?? null;

  const load = useCallback(async () => {
    setIsLoading(true);
    const result = await adminGet<PaginatedData<Customer>>("/customers?per_page=50");

    if (result.success) {
      setCustomers(result.data.items);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount'ta veri cekme deseni
    load();
  }, [load]);

  function openCreateForm() {
    setForm({ ...EMPTY_FORM, isDefault: customers.length === 0 });
    setError(null);
    setIsFormOpen(true);
  }

  function openEditForm(customer: Customer) {
    setForm({ id: customer.id, name: customer.name, email: customer.email, isDefault: customer.isDefault });
    setError(null);
    setIsFormOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = { name: form.name, email: form.email, isDefault: form.isDefault };
    const result = form.id
      ? await adminPut<Customer>(`/customers/${form.id}`, payload)
      : await adminPost<Customer>("/customers", payload);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.errors?.email?.[0] ?? result.errors?.name?.[0] ?? result.message);
      return;
    }

    setFeedback(result.message);
    setIsFormOpen(false);
    load();
  }

  async function handleSetAsNotificationRecipient(customer: Customer) {
    if (customer.isDefault) {
      return;
    }

    setBusyId(customer.id);
    const result = await adminPut<Customer>(`/customers/${customer.id}`, {
      name: customer.name,
      email: customer.email,
      isDefault: true,
    });
    setBusyId(null);

    if (result.success) {
      setFeedback(`${customer.name} artık randevu bildirimlerini alacak.`);
      load();
    }
  }

  async function handleDelete(customer: Customer) {
    if (customer.isDefault) {
      window.alert("Bildirim alıcısını silemezsiniz. Önce başka bir kaydı bildirim alıcısı yapın.");
      return;
    }

    if (!window.confirm(`${customer.name} kaydını silmek istediğinize emin misiniz?`)) {
      return;
    }

    setBusyId(customer.id);
    const result = await adminDelete(`/customers/${customer.id}`);
    setBusyId(null);

    if (result.success) {
      setFeedback(result.message);
      load();
    }
  }

  const columns = useMemo<ColumnDef<Customer, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Ad",
      },
      {
        accessorKey: "email",
        header: "E-posta",
        cell: ({ getValue }) => <span className="text-zinc-400">{String(getValue())}</span>,
      },
      {
        accessorKey: "isDefault",
        header: "Bildirim",
        cell: ({ row }) =>
          row.original.isDefault ? (
            <span className="inline-flex rounded-full bg-[#14F195]/10 px-2.5 py-1 text-xs font-medium text-[#14F195]">
              Bildirim alıcısı
            </span>
          ) : (
            <button
              type="button"
              disabled={busyId === row.original.id}
              onClick={() => handleSetAsNotificationRecipient(row.original)}
              title="Bildirim alıcısı yap"
              aria-label="Bildirim alıcısı yap"
              className="cursor-pointer rounded-md p-1.5 text-amber-400 transition hover:bg-amber-500/10 hover:text-amber-300 disabled:opacity-50"
            >
              <BellIcon />
            </button>
          ),
      },
      {
        id: "actions",
        header: () => <span className="block text-right">İşlemler</span>,
        enableSorting: false,
        cell: ({ row }) => {
          const customer = row.original;

          return (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => openEditForm(customer)}
                title="Düzenle"
                aria-label="Düzenle"
                className="cursor-pointer rounded-md p-1.5 text-violet-400 transition hover:bg-violet-500/10 hover:text-violet-300"
              >
                <PencilIcon />
              </button>
              <button
                type="button"
                disabled={busyId === customer.id || customer.isDefault}
                onClick={() => handleDelete(customer)}
                title="Sil"
                aria-label="Sil"
                className="cursor-pointer rounded-md p-1.5 text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
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
        title="Müşteriler"
        description="Yeni randevu oluşunca bildirim mailinin gideceği müşteri/yetkili burada seçilir."
        action={
          <button
            type="button"
            onClick={openCreateForm}
            className="cursor-pointer rounded-full bg-[#14F195] px-5 py-2 text-sm font-semibold text-black transition hover:bg-white hover:text-[#14F195]"
          >
            + Müşteri Ekle
          </button>
        }
      />

      {!isLoading && (
        <div className="mb-4 rounded-xl border border-zinc-800 bg-[#18151c] px-4 py-3 text-sm">
          {defaultCustomer ? (
            <p className="text-zinc-300">
              Aktif bildirim alıcısı:{" "}
              <span className="font-semibold text-white">{defaultCustomer.name}</span>{" "}
              <span className="text-zinc-500">({defaultCustomer.email})</span>
            </p>
          ) : (
            <p className="text-yellow-400">
              Bildirim alıcısı seçilmemiş. Aşağıdan bir kaydı “Bildirim alıcısı yap” ile seçin.
            </p>
          )}
        </div>
      )}

      {feedback && <p className="mb-4 text-sm text-[#14F195]">{feedback}</p>}

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 flex flex-col gap-4 rounded-xl border border-zinc-800 bg-[#18151c] p-6 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label htmlFor="customer-name" className="mb-1.5 block text-sm font-medium text-white">
              Ad
            </label>
            <input
              id="customer-name"
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-2 text-sm text-white outline-none focus:border-zinc-400"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="customer-email" className="mb-1.5 block text-sm font-medium text-white">
              E-posta
            </label>
            <input
              id="customer-email"
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-2 text-sm text-white outline-none focus:border-zinc-400"
            />
          </div>

          <label className="flex items-center gap-2 pb-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) => setForm((prev) => ({ ...prev, isDefault: event.target.checked }))}
              className="h-4 w-4 rounded border-zinc-700 bg-black"
            />
            Bildirim alıcısı yap
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-full bg-[#14F195] px-5 py-2 text-sm font-semibold text-black transition hover:bg-white hover:text-[#14F195] disabled:opacity-60 disabled:hover:bg-[#14F195] disabled:hover:text-black"
            >
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="cursor-pointer rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-black"
            >
              Vazgeç
            </button>
          </div>

          {error && <p className="w-full text-sm text-red-400">{error}</p>}
        </form>
      )}

      <AdminDataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        emptyMessage="Müşteri bulunamadı."
      />
    </div>
  );
}
