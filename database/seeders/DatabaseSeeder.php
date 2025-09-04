<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        $testUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Seed PEVs and transfers
        $this->call([
            PevSeeder::class,
        ]);

        // Create some PEVs for the test user
        \App\Models\Pev::factory()->count(3)->create([
            'user_id' => $testUser->id,
        ]);
    }
}
