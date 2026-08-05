<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\BusinessRuleException;
use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Support\ListQuery;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public function __construct(
        private readonly CustomerRepositoryInterface $customers,
    ) {}

    public function list(ListQuery $listQuery): LengthAwarePaginator
    {
        return $this->customers->paginateOrdered($listQuery);
    }

    /**
     * @param  array{name: string, email: string, isDefault?: bool}  $data
     */
    public function create(array $data): Customer
    {
        return DB::transaction(function () use ($data) {
            $isDefault = (bool) ($data['isDefault'] ?? false);

            if ($isDefault) {
                $this->customers->clearDefaultExcept();
            }

            /** @var Customer $customer */
            $customer = $this->customers->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'is_default' => $isDefault,
            ]);

            return $customer;
        });
    }

    /**
     * @param  array{name: string, email: string, isDefault?: bool}  $data
     */
    public function update(Customer $customer, array $data): Customer
    {
        return DB::transaction(function () use ($customer, $data) {
            $isDefault = (bool) ($data['isDefault'] ?? $customer->is_default);

            if ($isDefault) {
                $this->customers->clearDefaultExcept($customer->id);
            }

            /** @var Customer $updated */
            $updated = $this->customers->update($customer, [
                'name' => $data['name'],
                'email' => $data['email'],
                'is_default' => $isDefault,
            ]);

            return $updated;
        });
    }

    /**
     * @throws BusinessRuleException
     */
    public function delete(Customer $customer): void
    {
        if ($customer->is_default) {
            throw new BusinessRuleException(
                'Bildirim alıcısı silinemez. Önce başka bir kaydı bildirim alıcısı yapın.',
            );
        }

        $this->customers->delete($customer);
    }
}
