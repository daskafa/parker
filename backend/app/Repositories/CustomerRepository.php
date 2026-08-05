<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Support\ListQuery;
use Illuminate\Pagination\LengthAwarePaginator;

class CustomerRepository extends BaseRepository implements CustomerRepositoryInterface
{
    public function __construct(Customer $model)
    {
        parent::__construct($model);
    }

    public function paginateOrdered(ListQuery $listQuery): LengthAwarePaginator
    {
        return $this->query()
            ->orderBy('name')
            ->paginate($listQuery->perPage);
    }

    public function findDefault(): ?Customer
    {
        return $this->query()->where('is_default', true)->first();
    }

    public function first(): ?Customer
    {
        return $this->query()->first();
    }

    public function clearDefaultExcept(?int $exceptId = null): void
    {
        $query = $this->query()->where('is_default', true);

        if ($exceptId !== null) {
            $query->where('id', '!=', $exceptId);
        }

        $query->update(['is_default' => false]);
    }
}
