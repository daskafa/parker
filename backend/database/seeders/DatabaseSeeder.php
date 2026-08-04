<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin panel demo girisi (sifre: "password").
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@newu.digital',
        ]);

        // Randevu bildirimlerinin gonderilecegi varsayilan musteri/yetkili.
        Customer::query()->firstOrCreate(
            ['email' => 'destek@newu.digital'],
            ['name' => 'NEWU Destek', 'is_default' => true],
        );
    }
}
