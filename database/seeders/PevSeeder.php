<?php

namespace Database\Seeders;

use App\Models\Pev;
use App\Models\PevTransfer;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PevSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some users if they don't exist
        $users = User::factory()->count(5)->create();

        // Create PEVs for users
        $users->each(function ($user) {
            Pev::factory()
                ->count(random_int(1, 3))
                ->for($user)
                ->create();
        });

        // Create some transfers
        $pevs = Pev::with('owner')->get();
        
        foreach ($pevs->take(3) as $pev) {
            $otherUsers = User::where('id', '!=', $pev->user_id)->get();
            if ($otherUsers->count() > 0) {
                PevTransfer::factory()
                    ->for($pev)
                    ->state([
                        'from_user_id' => $pev->user_id,
                        'to_user_id' => $otherUsers->random()->id,
                    ])
                    ->create();
            }
        }
    }
}