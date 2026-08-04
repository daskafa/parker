<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\AppointmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Mail\AppointmentConfirmationMail;
use App\Mail\AppointmentCustomerNotificationMail;
use App\Models\Appointment;
use App\Models\Customer;
use App\Services\AppointmentScheduleValidator;
use App\Services\AppointmentTokenValidator;
use App\Support\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AppointmentController extends Controller
{
    public function __construct(
        private readonly AppointmentTokenValidator $tokenValidator,
        private readonly AppointmentScheduleValidator $scheduleValidator,
    ) {}

    /**
     * GET /api/appointments - Protected. Listeleme, duruma/tarihe gore filtreleme ve siralama.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::query()->with(['subscriber', 'customer']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($from = $request->query('from')) {
            $query->whereDate('scheduled_at', '>=', $from);
        }

        if ($to = $request->query('to')) {
            $query->whereDate('scheduled_at', '<=', $to);
        }

        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';
        $query->orderBy('scheduled_at', $direction);

        $appointments = $query->paginate((int) $request->query('per_page', 15));

        return ApiResponse::paginated(
            AppointmentResource::collection($appointments),
            $appointments,
            'Randevular listelendi.',
        );
    }

    public function showByToken(string $token): JsonResponse
    {
        $subscriber = $this->tokenValidator->validate($token);

        return ApiResponse::success([
            'email' => $subscriber->email,
            'tokenExpiresAt' => $subscriber->token_expires_at,
        ], 'Token geçerli.');
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $subscriber = $this->tokenValidator->validate($request->validated('token'));

        $scheduledAt = Carbon::parse($request->validated('scheduledAt'));
        $this->scheduleValidator->validate($scheduledAt);

        $customer = Customer::where('is_default', true)->first() ?? Customer::first();

        $appointment = DB::transaction(function () use ($subscriber, $customer, $scheduledAt) {
            return Appointment::create([
                'subscriber_id' => $subscriber->id,
                'customer_id' => $customer?->id,
                'scheduled_at' => $scheduledAt,
                'status' => AppointmentStatus::Pending,
            ]);
        });

        $appointment->loadMissing('subscriber');

        $this->dispatchNotifications($appointment, $customer);

        return ApiResponse::success([
            'id' => $appointment->id,
            'scheduledAt' => $appointment->scheduled_at,
        ], 'Randevunuz başarıyla oluşturulmuştur.', 201);
    }

    /**
     * PATCH /api/appointments/{appointment} - Protected. Durum guncelleme.
     */
    public function update(UpdateAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $appointment->update(['status' => $request->validated('status')]);
        $appointment->loadMissing(['subscriber', 'customer']);

        return ApiResponse::success(new AppointmentResource($appointment), 'Randevu durumu güncellendi.');
    }

    /**
     * DELETE /api/appointments/{appointment} - Protected.
     */
    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->delete();

        return ApiResponse::success(null, 'Randevu silindi.');
    }

    private function dispatchNotifications(Appointment $appointment, ?Customer $customer): void
    {
        try {
            if ($customer) {
                Mail::to($customer->email)->queue(new AppointmentCustomerNotificationMail($appointment));
            } else {
                Log::warning('Randevu bildirimi gonderilemedi: tanimli musteri/yetkili bulunamadi.', [
                    'appointment_id' => $appointment->id,
                ]);
            }

            Mail::to($appointment->subscriber->email)->queue(new AppointmentConfirmationMail($appointment));
        } catch (\Throwable $e) {
            Log::error('Randevu mail bildirimleri gonderilirken hata olustu.', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
