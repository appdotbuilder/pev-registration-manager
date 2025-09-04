<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pev>
 */
class PevFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $makes = ['Tesla', 'Nissan', 'Chevrolet', 'BMW', 'Audi', 'Volkswagen', 'Ford', 'Hyundai', 'Kia', 'Lucid'];
        $models = [
            'Tesla' => ['Model 3', 'Model S', 'Model X', 'Model Y'],
            'Nissan' => ['Leaf', 'Ariya'],
            'Chevrolet' => ['Bolt EV', 'Bolt EUV'],
            'BMW' => ['i3', 'i4', 'iX'],
            'Audi' => ['e-tron', 'e-tron GT'],
            'Volkswagen' => ['ID.4', 'ID.3'],
            'Ford' => ['Mustang Mach-E', 'F-150 Lightning'],
            'Hyundai' => ['Ioniq 5', 'Kona Electric'],
            'Kia' => ['EV6', 'Niro EV'],
            'Lucid' => ['Air Dream', 'Air Touring']
        ];

        $make = fake()->randomElement($makes);
        $model = fake()->randomElement($models[$make]);
        $year = fake()->numberBetween(2015, 2024);

        return [
            'user_id' => User::factory(),
            'make' => $make,
            'model' => $model,
            'year' => $year,
            'vin' => fake()->unique()->regexify('[A-HJ-NPR-Z0-9]{17}'),
            'license_plate' => fake()->unique()->regexify('[A-Z0-9]{2,8}'),
            'color' => fake()->randomElement(['White', 'Black', 'Silver', 'Red', 'Blue', 'Gray', 'Green']),
            'battery_capacity' => fake()->randomFloat(1, 40, 100),
            'range_miles' => fake()->numberBetween(150, 500),
            'status' => fake()->randomElement(['active', 'inactive']),
        ];
    }

    /**
     * Indicate that the PEV is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the PEV is a Tesla.
     */
    public function tesla(): static
    {
        return $this->state(fn (array $attributes) => [
            'make' => 'Tesla',
            'model' => fake()->randomElement(['Model 3', 'Model S', 'Model X', 'Model Y']),
            'battery_capacity' => fake()->randomFloat(1, 75, 100),
            'range_miles' => fake()->numberBetween(250, 405),
        ]);
    }
}