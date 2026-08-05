<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubscriberRequest;
use App\Http\Resources\SubscriberResource;
use App\Models\Subscriber;
use App\Services\SubscriberService;
use App\Support\ApiResponse;
use App\Support\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    public function __construct(
        private readonly SubscriberService $subscribers,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->subscribers->list(
            ListQuery::fromRequest($request),
            $request->query('search'),
        );

        return ApiResponse::paginated(
            SubscriberResource::collection($paginator),
            $paginator,
        );
    }

    public function store(StoreSubscriberRequest $request): JsonResponse
    {
        $data = $this->subscribers->register($request->validated('email'));

        return ApiResponse::success($data, 'E-posta adresiniz kaydedilmiştir.', 201);
    }

    public function destroy(Subscriber $subscriber): JsonResponse
    {
        $this->subscribers->delete($subscriber);

        return ApiResponse::success(null, 'Kayıt silindi.');
    }

    public function resend(Subscriber $subscriber): JsonResponse
    {
        $this->subscribers->resendAppointmentLink($subscriber);

        return ApiResponse::success(null, 'Randevu bağlantısı yeniden gönderildi.');
    }
}
