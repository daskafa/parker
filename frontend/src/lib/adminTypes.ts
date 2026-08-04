export type PaginatedMeta = {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
};

export type PaginatedData<T> = {
  items: T[];
  meta: PaginatedMeta;
};

export type Subscriber = {
  id: number;
  email: string;
  createdAt: string;
  hasAppointment: boolean | null;
};

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

export type Appointment = {
  id: number;
  status: AppointmentStatus;
  statusLabel: string;
  scheduledAt: string;
  createdAt: string;
  subscriberEmail: string | null;
  customer: { id: number; name: string; email: string } | null;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  isDefault: boolean;
  createdAt: string;
};
