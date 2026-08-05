<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Subscriber;
use App\Repositories\Contracts\SubscriberRepositoryInterface;
use App\Support\ListQuery;
use Illuminate\Pagination\LengthAwarePaginator;

class SubscriberRepository extends BaseRepository implements SubscriberRepositoryInterface
{
    public function __construct(Subscriber $model)
    {
        parent::__construct($model);
    }

    public function findByEmail(string $email): ?Subscriber
    {
        return $this->query()->where('email', $email)->first();
    }

    public function findByToken(string $token): ?Subscriber
    {
        return $this->query()->where('token', $token)->first();
    }

    public function existsByEmail(string $email): bool
    {
        return $this->query()->where('email', $email)->exists();
    }

    public function paginateForAdmin(ListQuery $listQuery, ?string $search): LengthAwarePaginator
    {
        $query = $this->query()->with('appointment');

        if ($search) {
            $query->where('email', 'like', '%'.$search.'%');
        }

        return $query
            ->orderBy('created_at', $listQuery->direction)
            ->paginate($listQuery->perPage);
    }

    public function hasAppointment(Subscriber $subscriber): bool
    {
        return $subscriber->appointment()->exists();
    }
}
