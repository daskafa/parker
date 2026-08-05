<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $auth,
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        return ApiResponse::success(
            $this->auth->login($credentials['email'], $credentials['password']),
            'Giriş başarılı.',
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $this->auth->logout($request->user());

        return ApiResponse::success(null, 'Çıkış yapıldı.');
    }

    public function me(Request $request): JsonResponse
    {
        return ApiResponse::success(
            $this->auth->profile($request->user()),
            'Kullanıcı bilgisi.',
        );
    }
}
