<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Customer::query()->orderBy('name');

        $customers = $query->paginate((int) $request->query('per_page', 15));

        return ApiResponse::paginated(
            CustomerResource::collection($customers),
            $customers,
            'Müşteriler listelendi.',
        );
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $customer = DB::transaction(function () use ($request) {
            $isDefault = (bool) $request->validated('isDefault', false);

            if ($isDefault) {
                Customer::query()->where('is_default', true)->update(['is_default' => false]);
            }

            return Customer::create([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                'is_default' => $isDefault,
            ]);
        });

        return ApiResponse::success(new CustomerResource($customer), 'Müşteri eklendi.', 201);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        DB::transaction(function () use ($request, $customer) {
            $isDefault = (bool) $request->validated('isDefault', $customer->is_default);

            if ($isDefault) {
                Customer::query()->where('id', '!=', $customer->id)->where('is_default', true)->update(['is_default' => false]);
            }

            $customer->update([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                'is_default' => $isDefault,
            ]);
        });

        return ApiResponse::success(new CustomerResource($customer->fresh()), 'Müşteri güncellendi.');
    }

    public function destroy(Customer $customer): JsonResponse
    {
        if ($customer->is_default) {
            return ApiResponse::error(
                'Bildirim alıcısı silinemez. Önce başka bir kaydı bildirim alıcısı yapın.',
                422,
            );
        }

        $customer->delete();

        return ApiResponse::success(null, 'Müşteri silindi.');
    }
}
