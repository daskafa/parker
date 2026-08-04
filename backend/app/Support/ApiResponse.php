<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Tum API uclarinda kullanilan tutarli response zarfi (envelope).
 */
final class ApiResponse
{
    public static function success(mixed $data = null, string $message = 'İşlem başarılı.', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    /**
     * Panel listeleme uclarinda kullanilan tutarli sayfalama zarfi.
     */
    public static function paginated(
        AnonymousResourceCollection $items,
        LengthAwarePaginator $paginator,
        string $message = 'Kayıtlar listelendi.',
    ): JsonResponse {
        return self::success([
            'items' => $items,
            'meta' => [
                'currentPage' => $paginator->currentPage(),
                'lastPage' => $paginator->lastPage(),
                'total' => $paginator->total(),
                'perPage' => $paginator->perPage(),
            ],
        ], $message);
    }

    public static function error(string $message = 'Beklenmeyen bir hata oluştu, lütfen tekrar deneyiniz.', int $status = 500, mixed $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }
}
