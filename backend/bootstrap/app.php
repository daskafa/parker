<?php

use App\Exceptions\AppointmentSlotUnavailableException;
use App\Exceptions\InvalidAppointmentTokenException;
use App\Support\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Bu uygulama tamamen API-driven; kimliksiz istekleri bir "login"
        // web route'una yonlendirmeye calismak yerine dogrudan 401 JSON dondurulur.
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        // Merkezi hata yonetimi: api/* altindaki tum hatalar tutarli bir
        // {success, message, errors} zarfi ile donduruluyor.
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            if ($e instanceof InvalidAppointmentTokenException) {
                return ApiResponse::error($e->getMessage(), $e->status());
            }

            if ($e instanceof AppointmentSlotUnavailableException) {
                return ApiResponse::error($e->getMessage(), 409);
            }

            if ($e instanceof ValidationException) {
                return ApiResponse::error(
                    'Girdiğiniz bilgilerde hata var.',
                    422,
                    $e->errors(),
                );
            }

            if ($e instanceof AuthenticationException) {
                return ApiResponse::error('Bu işlem için giriş yapmanız gerekiyor.', 401);
            }

            if ($e instanceof AuthorizationException) {
                return ApiResponse::error('Bu işlemi yapmaya yetkiniz yok.', 403);
            }

            if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                return ApiResponse::error('İstenen kayıt bulunamadı.', 404);
            }

            if ($e instanceof HttpExceptionInterface) {
                $status = $e->getStatusCode();
                $message = $status === 429
                    ? 'Çok fazla istek gönderdiniz, lütfen bir süre sonra tekrar deneyiniz.'
                    : ($e->getMessage() ?: 'Beklenmeyen bir hata oluştu, lütfen tekrar deneyiniz.');

                return ApiResponse::error($message, $status);
            }

            report($e);

            $message = config('app.debug')
                ? $e->getMessage()
                : 'Beklenmeyen bir hata oluştu, lütfen tekrar deneyiniz.';

            return ApiResponse::error($message, 500);
        });
    })->create();
