import { AppointmentBooking } from "@/components/appointment/AppointmentBooking";

type AppointmentPageProps = {
  params: Promise<{ token: string }>;
};

export default async function AppointmentPage({ params }: AppointmentPageProps) {
  const { token } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <AppointmentBooking token={token} />
      </div>
    </div>
  );
}
