<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Repositories\Contracts\AppointmentRepositoryInterface;
use App\Support\ListQuery;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;

class AppointmentRepository extends BaseRepository implements AppointmentRepositoryInterface
{
    public function __construct(Appointment $model)
    {
        parent::__construct($model);
    }

    public function paginateForAdmin(
        ListQuery $listQuery,
        ?string $status,
        ?string $from,
        ?string $to,
    ): LengthAwarePaginator {
        $query = $this->query()->with(['subscriber', 'customer']);

        if ($status) {
            $query->where('status', $status);
        }

        if ($from) {
            $query->whereDate('scheduled_at', '>=', $from);
        }

        if ($to) {
            $query->whereDate('scheduled_at', '<=', $to);
        }

        return $query
            ->orderBy('scheduled_at', $listQuery->direction)
            ->paginate($listQuery->perPage);
    }

    public function slotTaken(Carbon $scheduledAt): bool
    {
        return $this->query()
            ->where('scheduled_at', $scheduledAt)
            ->where('status', '!=', AppointmentStatus::Cancelled->value)
            ->exists();
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function createForSubscriber(array $attributes): Appointment
    {
        /** @var Appointment $appointment */
        $appointment = $this->create($attributes);

        return $appointment;
    }
}
