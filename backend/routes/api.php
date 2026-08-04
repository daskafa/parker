<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\SubscriberController;
use Illuminate\Support\Facades\Route;

// --- Public uclar ---

Route::post('/subscribers', [SubscriberController::class, 'store'])
    ->middleware('throttle:6,1');

Route::get('/appointments/token/{token}', [AppointmentController::class, 'showByToken'])
    ->middleware('throttle:20,1');

Route::post('/appointments', [AppointmentController::class, 'store'])
    ->middleware('throttle:10,1');

Route::post('/auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1');

// --- Korumali (admin panel) uclar ---

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/subscribers', [SubscriberController::class, 'index']);
    Route::delete('/subscribers/{subscriber}', [SubscriberController::class, 'destroy']);
    Route::post('/subscribers/{subscriber}/resend', [SubscriberController::class, 'resend']);

    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::patch('/appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);

    Route::get('/customers', [CustomerController::class, 'index']);
    Route::post('/customers', [CustomerController::class, 'store']);
    Route::put('/customers/{customer}', [CustomerController::class, 'update']);
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);
});
