<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Subscriber;
use App\Support\ListQuery;
use Illuminate\Pagination\LengthAwarePaginator;

interface SubscriberRepositoryInterface extends RepositoryInterface
{
    public function findByEmail(string $email): ?Subscriber;

    public function findByToken(string $token): ?Subscriber;

    public function existsByEmail(string $email): bool;

    public function paginateForAdmin(ListQuery $listQuery, ?string $search): LengthAwarePaginator;

    public function hasAppointment(Subscriber $subscriber): bool;
}
