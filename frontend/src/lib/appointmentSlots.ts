// Backend (config/appointments.php) ile ayni degerler.
export const BUSINESS_START_HOUR = 9;
export const BUSINESS_END_HOUR = 18;
export const SLOT_MINUTES = 30;
export const BUSINESS_DAYS = [1, 2, 3, 4, 5]; // Pazartesi - Cuma

export function isBusinessDay(date: Date): boolean {
  return BUSINESS_DAYS.includes(date.getDay());
}

export function getTimeSlots(): string[] {
  const slots: string[] = [];

  for (let hour = BUSINESS_START_HOUR; hour < BUSINESS_END_HOUR; hour += 1) {
    for (let minute = 0; minute < 60; minute += SLOT_MINUTES) {
      slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
  }

  return slots;
}

export function todayIsoDate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().split("T")[0];
}

export function isSlotInPast(dateIso: string, time: string): boolean {
  const [hour, minute] = time.split(":").map(Number);
  const slotDate = new Date(`${dateIso}T00:00:00`);
  slotDate.setHours(hour, minute, 0, 0);
  return slotDate.getTime() <= Date.now();
}

export function buildScheduledAt(dateIso: string, time: string): string {
  return `${dateIso}T${time}:00`;
}
