<?php

namespace Tests\Feature;

use App\Models\Pev;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PevTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_pevs_index(): void
    {
        $user = User::factory()->create();
        $pevs = Pev::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/pevs');

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('pevs/index')
                ->has('pevs.data', 3)
        );
    }

    public function test_user_can_create_pev(): void
    {
        $user = User::factory()->create();

        $pevData = [
            'make' => 'Tesla',
            'model' => 'Model 3',
            'year' => 2023,
            'vin' => '5YJ3E1EA5JF012345',
            'license_plate' => 'TEST123',
            'color' => 'White',
            'battery_capacity' => 75.5,
            'range_miles' => 300,
        ];

        $response = $this->actingAs($user)->post('/pevs', $pevData);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('pevs', [
            'user_id' => $user->id,
            'make' => 'Tesla',
            'model' => 'Model 3',
            'vin' => '5YJ3E1EA5JF012345',
        ]);
    }

    public function test_user_can_view_their_pev(): void
    {
        $user = User::factory()->create();
        $pev = Pev::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get("/pevs/{$pev->id}");

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('pevs/show')
                ->where('pev.id', $pev->id)
        );
    }

    public function test_user_cannot_view_other_users_pev(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $pev = Pev::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)->get("/pevs/{$pev->id}");

        $response->assertForbidden();
    }

    public function test_user_can_update_their_pev(): void
    {
        $user = User::factory()->create();
        $pev = Pev::factory()->create(['user_id' => $user->id]);

        $updateData = [
            'make' => 'Updated Make',
            'model' => 'Updated Model',
            'year' => 2024,
            'vin' => $pev->vin, // Keep the same VIN
            'license_plate' => $pev->license_plate, // Keep the same plate
            'color' => 'Updated Color',
        ];

        $response = $this->actingAs($user)->put("/pevs/{$pev->id}", $updateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('pevs', [
            'id' => $pev->id,
            'make' => 'Updated Make',
            'model' => 'Updated Model',
            'color' => 'Updated Color',
        ]);
    }

    public function test_user_can_delete_their_pev(): void
    {
        $user = User::factory()->create();
        $pev = Pev::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete("/pevs/{$pev->id}");

        $response->assertRedirect('/pevs');
        $this->assertDatabaseMissing('pevs', ['id' => $pev->id]);
    }

    public function test_vin_must_be_unique(): void
    {
        $user = User::factory()->create();
        Pev::factory()->create(['vin' => '1HGBH41JXMN109186']);

        $pevData = [
            'make' => 'Tesla',
            'model' => 'Model 3',
            'year' => 2023,
            'vin' => '1HGBH41JXMN109186',
            'license_plate' => 'UNIQUE123',
        ];

        $response = $this->actingAs($user)->post('/pevs', $pevData);

        $response->assertSessionHasErrors('vin');
    }

    public function test_license_plate_must_be_unique(): void
    {
        $user = User::factory()->create();
        Pev::factory()->create(['license_plate' => 'DUPLICATE']);

        $pevData = [
            'make' => 'Tesla',
            'model' => 'Model 3',
            'year' => 2023,
            'vin' => '1HGBH41JXMN109187',
            'license_plate' => 'DUPLICATE',
        ];

        $response = $this->actingAs($user)->post('/pevs', $pevData);

        $response->assertSessionHasErrors('license_plate');
    }

    public function test_user_can_search_pevs(): void
    {
        $user = User::factory()->create();
        $tesla = Pev::factory()->create([
            'user_id' => $user->id,
            'make' => 'Tesla',
            'model' => 'Model 3'
        ]);
        $nissan = Pev::factory()->create([
            'user_id' => $user->id,
            'make' => 'Nissan',
            'model' => 'Leaf'
        ]);

        $response = $this->actingAs($user)->get('/pevs?search=Tesla');

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('pevs/index')
                ->has('pevs.data', 1)
                ->where('pevs.data.0.id', $tesla->id)
        );
    }
}