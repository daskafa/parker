<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubscriberRequest;
use App\Http\Resources\SubscriberResource;
use App\Mail\SubscriberRegisteredMail;
use App\Models\Subscriber;
use App\Support\ApiResponse;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class SubscriberController extends Controller
{
    /**
     * GET /api/subscribers - Protected. Listeleme, e-posta arama, tarihe gore siralama.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Subscriber::query()->with('appointment');

        if ($search = $request->query('search')) {
            $query->where('email', 'like', '%'.$search.'%');
        }

        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';
        $query->orderBy('created_at', $direction);

        $subscribers = $query->paginate((int) $request->query('per_page', 15));

        return ApiResponse::paginated(
            SubscriberResource::collection($subscribers),
            $subscribers,
        );
    }

    public function store(StoreSubscriberRequest $request): JsonResponse
    {
        $email = $request->validated('email');

        if (Subscriber::where('email', $email)->exists()) {
            return ApiResponse::error('Bu e-posta adresi zaten kayıtlı.', 409);
        }

        try {
            $subscriber = Subscriber::create([
                'email' => $email,
                'token' => Str::random(48),
                'token_expires_at' => now()->addDays((int) config('appointments.token_ttl_days')),
            ]);
        } catch (UniqueConstraintViolationException) {
            // Ayni anda gelen es zamanli istek yarisi (race condition) yakalanir.
            return ApiResponse::error('Bu e-posta adresi zaten kayıtlı.', 409);
        }

        $this->sendRegistrationMail($subscriber);

        return ApiResponse::success(
            [
                'id' => $subscriber->id,
                'email' => $subscriber->email,
                'createdAt' => $subscriber->created_at,
            ],
            'E-posta adresiniz kaydedilmiştir.',
            201,
        );
    }

    /**
     * DELETE /api/subscribers/{subscriber} - Protected.
     */
    public function destroy(Subscriber $subscriber): JsonResponse
    {
        $subscriber->delete();

        return ApiResponse::success(null, 'Kayıt silindi.');
    }

    /**
     * POST /api/subscribers/{subscriber}/resend - Protected.
     * Randevu baglantisini yeniden gonderir; token suresi dolmussa yeniler.
     */
    public function resend(Subscriber $subscriber): JsonResponse
    {
        if ($subscriber->appointment()->exists()) {
            return ApiResponse::error('Bu kayıt için zaten bir randevu oluşturulmuş.', 409);
        }

        if ($subscriber->isTokenExpired()) {
            $subscriber->update([
                'token' => Str::random(48),
                'token_expires_at' => now()->addDays((int) config('appointments.token_ttl_days')),
            ]);
        }

        $this->sendRegistrationMail($subscriber);

        return ApiResponse::success(null, 'Randevu bağlantısı yeniden gönderildi.');
    }

    private function sendRegistrationMail(Subscriber $subscriber): void
    {
        try {
            Mail::to($subscriber->email)->queue(new SubscriberRegisteredMail($subscriber));
        } catch (\Throwable $e) {
            // Kayit hic bir sekilde kaybedilmez; mail hatasi sadece loglanir.
            Log::error('Subscriber registration mail could not be queued.', [
                'subscriber_id' => $subscriber->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
