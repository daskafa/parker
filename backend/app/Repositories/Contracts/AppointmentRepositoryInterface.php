<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Appointment;
use App\Support\ListQuery;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;

interface AppointmentRepositoryInterface extends RepositoryInterface
{
    public function paginateForAdmin(
        ListQuery $listQuery,
        ?string $status,
        ?string $from,
        ?string $to,
    ): LengthAwarePaginator;

    public function slotTaken(Carbon $scheduledAt): bool;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function createForSubscriber(array $attributes): Appointment;
}
