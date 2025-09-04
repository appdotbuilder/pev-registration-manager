<?php

namespace Database\Factories;

use App\Models\Pev;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PevTransfer>
 */
class PevTransferFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $initiatedAt = fake()->dateTimeBetween('-6 months', 'now');

        return [
            'pev_id' => Pev::factory(),
            'from_user_id' => User::factory(),
            'to_user_id' => fake()->boolean(70) ? User::factory() : null,
            'to_email' => fake()->boolean(30) ? fake()->safeEmail() : null,
            'to_name' => fake()->boolean(30) ? fake()->name() : null,
            'to_phone' => fake()->boolean(30) ? fake()->phoneNumber() : null,
            'status' => fake()->randomElement(['pending', 'completed', 'cancelled']),
            'notes' => fake()->optional()->paragraph(),
            'initiated_at' => $initiatedAt,
            'completed_at' => fake()->boolean(60) ? fake()->dateTimeBetween($initiatedAt, 'now') : null,
        ];
    }

    /**
     * Indicate that the transfer is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the transfer is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'completed_at' => fake()->dateTimeBetween($attributes['initiated_at'] ?? '-1 month', 'now'),
        ]);
    }
}