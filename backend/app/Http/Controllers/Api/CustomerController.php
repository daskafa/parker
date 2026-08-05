<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Services\CustomerService;
use App\Support\ApiResponse;
use App\Support\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct(
        private readonly CustomerService $customers,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->customers->list(ListQuery::fromRequest($request));

        return ApiResponse::paginated(
            CustomerResource::collection($paginator),
            $paginator,
            'Müşteriler listelendi.',
        );
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $customer = $this->customers->create($request->validated());

        return ApiResponse::success(new CustomerResource($customer), 'Müşteri eklendi.', 201);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        $updated = $this->customers->update($customer, $request->validated());

        return ApiResponse::success(new CustomerResource($updated), 'Müşteri güncellendi.');
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $this->customers->delete($customer);

        return ApiResponse::success(null, 'Müşteri silindi.');
    }
}
