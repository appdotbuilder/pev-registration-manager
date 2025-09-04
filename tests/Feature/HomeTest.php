<?php

namespace Tests\Feature;

use App\Models\Pev;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_welcome_page(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
        );
    }

    public function test_authenticated_user_redirected_to_dashboard(): void
    {
        $user = User::factory()->create();
        $pevs = Pev::factory()->count(2)->active()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('dashboard')
                ->has('userPevs', 2)
                ->where('totalPevs', 2)
                ->where('activePevs', 2)
        );
    }

    public function test_public_pev_search_works(): void
    {
        $user = User::factory()->create();
        $tesla = Pev::factory()->create([
            'user_id' => $user->id,
            'make' => 'Tesla',
            'model' => 'Model 3',
            'license_plate' => 'TESLA123',
            'status' => 'active',
        ]);

        $response = $this->get('/?search=TESLA123&search_type=license_plate');

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('searchResults', 1)
                ->where('searchResults.0.id', $tesla->id)
        );
    }

    public function test_public_search_by_vin(): void
    {
        $user = User::factory()->create();
        $pev = Pev::factory()->create([
            'user_id' => $user->id,
            'vin' => 'SEARCHABLE123VIN67',
            'status' => 'active',
        ]);

        $response = $this->get('/?search=SEARCHABLE123&search_type=vin');

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('searchResults', 1)
                ->where('searchResults.0.id', $pev->id)
        );
    }

    public function test_public_search_by_make_model(): void
    {
        $user = User::factory()->create();
        $pev = Pev::factory()->create([
            'user_id' => $user->id,
            'make' => 'UniqueMake',
            'model' => 'UniqueModel',
            'status' => 'active',
        ]);

        $response = $this->get('/?search=UniqueMake&search_type=make_model');

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('searchResults', 1)
                ->where('searchResults.0.id', $pev->id)
        );
    }

    public function test_inactive_pevs_not_shown_in_public_search(): void
    {
        $user = User::factory()->create();
        $activePev = Pev::factory()->create([
            'user_id' => $user->id,
            'license_plate' => 'ACTIVE123',
            'status' => 'active',
        ]);
        $inactivePev = Pev::factory()->create([
            'user_id' => $user->id,
            'license_plate' => 'INACTIVE123',
            'status' => 'inactive',
        ]);

        $response = $this->get('/?search=123&search_type=license_plate');

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('searchResults', 1) // Only the active one
                ->where('searchResults.0.id', $activePev->id)
        );
    }
}