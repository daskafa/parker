<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Services\AppointmentService;
use App\Support\ApiResponse;
use App\Support\ListQuery;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function __construct(
        private readonly AppointmentService $appointments,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->appointments->list(
            ListQuery::fromRequest($request),
            $request->query('status'),
            $request->query('from'),
            $request->query('to'),
        );

        return ApiResponse::paginated(
            AppointmentResource::collection($paginator),
            $paginator,
            'Randevular listelendi.',
        );
    }

    public function showByToken(string $token): JsonResponse
    {
        return ApiResponse::success(
            $this->appointments->validateToken($token),
            'Token geçerli.',
        );
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $data = $this->appointments->create(
            $request->validated('token'),
            Carbon::parse($request->validated('scheduledAt')),
        );

        return ApiResponse::success($data, 'Randevunuz başarıyla oluşturulmuştur.', 201);
    }

    public function update(UpdateAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $updated = $this->appointments->updateStatus(
            $appointment,
            $request->validated('status'),
        );

        return ApiResponse::success(new AppointmentResource($updated), 'Randevu durumu güncellendi.');
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        $this->appointments->delete($appointment);

        return ApiResponse::success(null, 'Randevu silindi.');
    }
}
