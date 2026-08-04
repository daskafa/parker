"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import {
  buildScheduledAt,
  getTimeSlots,
  isBusinessDay,
  isSlotInPast,
  todayIsoDate,
} from "@/lib/appointmentSlots";

type TokenData = {
  email: string;
  tokenExpiresAt: string;
};

type AppointmentData = {
  id: number;
  scheduledAt: string;
};

type ViewState =
  | { step: "loading" }
  | { step: "invalid"; message: string }
  | { step: "form"; email: string }
  | { step: "success"; scheduledAt: string };

const DATE_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#18151c] p-8 sm:p-10">
      <div className="mb-8 flex justify-center">
        <Image src="/logo.png" alt="NEWU" width={646} height={96} priority className="h-8 w-auto sm:h-10" />
      </div>
      {children}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5" aria-hidden>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path strokeLinecap="round" d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  );
}

export function AppointmentBooking({ token }: { token: string }) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ViewState>({ step: "loading" });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function validateToken() {
      const result = await apiGet<TokenData>(`/appointments/token/${token}`);

      if (!isMounted) {
        return;
      }

      if (result.success) {
        setState({ step: "form", email: result.data.email });
        return;
      }

      setState({ step: "invalid", message: result.message });
    }

    validateToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const timeSlots = useMemo(() => getTimeSlots(), []);

  const availableSlots = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    return timeSlots.filter((time) => !isSlotInPast(selectedDate, time));
  }, [selectedDate, timeSlots]);

  function openDatePicker() {
    const input = dateInputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;

    if (!input) {
      return;
    }

    try {
      input.showPicker?.();
    } catch {
      input.focus();
    }
  }

  function handleDateChange(value: string) {
    setSelectedDate(value);
    setSelectedTime(null);
    setSubmitError(null);

    if (!value) {
      setDateError(null);
      return;
    }

    const parsed = new Date(`${value}T00:00:00`);

    if (!isBusinessDay(parsed)) {
      setDateError("Randevular yalnızca Pazartesi - Cuma günleri arasında oluşturulabilir.");
      return;
    }

    setDateError(null);
  }

  async function handleSubmit() {
    if (!selectedDate || !selectedTime || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const scheduledAt = buildScheduledAt(selectedDate, selectedTime);
    const result = await apiPost<AppointmentData>("/appointments", { token, scheduledAt });

    setIsSubmitting(false);

    if (result.success) {
      setState({ step: "success", scheduledAt: result.data.scheduledAt });
      return;
    }

    setSubmitError(result.errors?.scheduledAt?.[0] ?? result.message);
  }

  if (state.step === "loading") {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
          <p className="text-sm text-zinc-400">Bağlantı doğrulanıyor...</p>
        </div>
      </Shell>
    );
  }

  if (state.step === "invalid") {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-xl text-red-400">
            !
          </div>
          <h1 className="text-xl font-semibold text-white">Bu bağlantı kullanılamıyor</h1>
          <p className="text-sm text-zinc-400">{state.message}</p>
          <Link
            href="/"
            className="mt-2 inline-flex cursor-pointer items-center rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-black"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </Shell>
    );
  }

  if (state.step === "success") {
    const scheduled = new Date(state.scheduledAt);

    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#14F195]/10 text-xl text-[#14F195]">
            ✓
          </div>
          <h1 className="text-xl font-semibold text-white">Randevunuz oluşturuldu</h1>
          <p className="text-sm text-zinc-400">Onay e-postası adresinize gönderildi.</p>
          <div className="mt-1 w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-sm font-medium text-white">
            {DATETIME_FORMATTER.format(scheduled)}
          </div>
          <Link
            href="/"
            className="mt-2 w-full cursor-pointer rounded-full bg-[#14F195] py-2.5 text-center text-sm font-semibold text-black transition hover:bg-white hover:text-[#14F195]"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="text-center">
        <h1 className="text-xl font-semibold text-white">Randevu Oluştur</h1>
        <p className="mt-1 text-sm text-zinc-400">Uygun bir tarih ve saat seçerek görüşmeyi planlayın.</p>
        <p className="mt-3 text-xs text-zinc-500">{state.email}</p>
      </div>

      <div className="mt-8">
        <label htmlFor="appointment-date" className="mb-1.5 block text-sm font-medium text-white">
          Tarih
        </label>
        <div className="relative">
          <div className="pointer-events-none flex w-full items-center rounded-lg border border-zinc-700 bg-black px-4 py-2.5">
            <span className={`flex-1 text-sm ${selectedDate ? "text-white" : "text-zinc-500"}`}>
              {selectedDate
                ? DATE_FORMATTER.format(new Date(`${selectedDate}T00:00:00`))
                : "Seçiniz"}
            </span>
            <span className="text-zinc-500">
              <CalendarIcon />
            </span>
          </div>
          <input
            id="appointment-date"
            ref={dateInputRef}
            type="date"
            min={todayIsoDate()}
            value={selectedDate}
            onChange={(event) => handleDateChange(event.target.value)}
            onClick={openDatePicker}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        {dateError && <p className="mt-2 text-sm text-red-400">{dateError}</p>}
      </div>

      {selectedDate && !dateError && (
        <div className="mt-5">
          <p className="mb-1.5 block text-sm font-medium text-white">Saat</p>
          {availableSlots.length === 0 ? (
            <p className="text-sm text-zinc-500">Bu tarih için uygun saat bulunmuyor.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {availableSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    selectedTime === time
                      ? "border-[#14F195] bg-[#14F195]/10 text-[#14F195]"
                      : "border-zinc-700 text-zinc-300 hover:border-white hover:bg-white hover:text-black"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {submitError && <p className="mt-4 text-sm text-red-400">{submitError}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedDate || !selectedTime || isSubmitting || Boolean(dateError)}
        className="mt-8 w-full cursor-pointer rounded-full bg-[#14F195] py-2.5 text-sm font-semibold text-black transition hover:bg-white hover:text-[#14F195] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#14F195] disabled:hover:text-black"
      >
        {isSubmitting ? "Gönderiliyor..." : "Randevuyu Onayla"}
      </button>
    </Shell>
  );
}
