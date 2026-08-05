<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\Request;

final class ListQuery
{
    public function __construct(
        public readonly int $perPage,
        public readonly string $direction,
    ) {}

    public static function fromRequest(Request $request, int $defaultPerPage = 15): self
    {
        return new self(
            perPage: max(1, min(100, (int) $request->query('per_page', $defaultPerPage))),
            direction: $request->query('direction') === 'asc' ? 'asc' : 'desc',
        );
    }
}
