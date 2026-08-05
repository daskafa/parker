<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Customer;
use App\Support\ListQuery;
use Illuminate\Pagination\LengthAwarePaginator;

interface CustomerRepositoryInterface extends RepositoryInterface
{
    public function paginateOrdered(ListQuery $listQuery): LengthAwarePaginator;

    public function findDefault(): ?Customer;

    public function first(): ?Customer;

    public function clearDefaultExcept(?int $exceptId = null): void;
}
