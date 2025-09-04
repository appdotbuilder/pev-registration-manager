<?php

namespace Tests\Feature;

use App\Models\Pev;
use App\Models\PevTransfer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PevTransferTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_transfers(): void
    {
        $user = User::factory()->create();
        $pev = Pev::factory()->create(['user_id' => $user->id]);
        $transfer = PevTransfer::factory()->create([
            'pev_id' => $pev->id,
            'from_user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get('/pev-transfers');

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('pev-transfers/index')
                ->has('transfers.data', 1)
        );
    }

    public function test_user_can_create_transfer(): void
    {
        $user = User::factory()->create();
        $pev = Pev::factory()->create(['user_id' => $user->id]);

        $transferData = [
            'pev_id' => $pev->id,
            'to_email' => 'newowner@example.com',
            'to_name' => 'New Owner',
            'to_phone' => '555-1234',
            'notes' => 'Transfer notes',
        ];

        $response = $this->actingAs($user)->post('/pev-transfers', $transferData);

        $response->assertRedirect();
        $this->assertDatabaseHas('pev_transfers', [
            'pev_id' => $pev->id,
            'from_user_id' => $user->id,
            'to_email' => 'newowner@example.com',
            'status' => 'pending',
        ]);
    }

    public function test_user_cannot_transfer_others_pev(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $pev = Pev::factory()->create(['user_id' => $user2->id]);

        $transferData = [
            'pev_id' => $pev->id,
            'to_email' => 'newowner@example.com',
            'to_name' => 'New Owner',
        ];

        $response = $this->actingAs($user1)->post('/pev-transfers', $transferData);

        $response->assertForbidden();
    }

    public function test_user_can_complete_transfer(): void
    {
        $fromUser = User::factory()->create();
        $toUser = User::factory()->create();
        $pev = Pev::factory()->create(['user_id' => $fromUser->id]);
        $transfer = PevTransfer::factory()->create([
            'pev_id' => $pev->id,
            'from_user_id' => $fromUser->id,
            'to_user_id' => $toUser->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($fromUser)->patch("/pev-transfers/{$transfer->id}", [
            'action' => 'complete',
        ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('pev_transfers', [
            'id' => $transfer->id,
            'status' => 'completed',
        ]);

        $this->assertDatabaseHas('pevs', [
            'id' => $pev->id,
            'user_id' => $toUser->id,
        ]);
    }

    public function test_user_can_cancel_transfer(): void
    {
        $user = User::factory()->create();
        $pev = Pev::factory()->create(['user_id' => $user->id]);
        $transfer = PevTransfer::factory()->create([
            'pev_id' => $pev->id,
            'from_user_id' => $user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->patch("/pev-transfers/{$transfer->id}", [
            'action' => 'cancel',
        ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('pev_transfers', [
            'id' => $transfer->id,
            'status' => 'cancelled',
        ]);

        // PEV should remain with original owner
        $this->assertDatabaseHas('pevs', [
            'id' => $pev->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_only_transfer_owner_can_manage_transfer(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $pev = Pev::factory()->create(['user_id' => $user1->id]);
        $transfer = PevTransfer::factory()->create([
            'pev_id' => $pev->id,
            'from_user_id' => $user1->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user2)->patch("/pev-transfers/{$transfer->id}", [
            'action' => 'complete',
        ]);

        $response->assertForbidden();
    }

    public function test_user_can_view_transfer_details(): void
    {
        $user = User::factory()->create();
        $pev = Pev::factory()->create(['user_id' => $user->id]);
        $transfer = PevTransfer::factory()->create([
            'pev_id' => $pev->id,
            'from_user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get("/pev-transfers/{$transfer->id}");

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('pev-transfers/show')
                ->where('transfer.id', $transfer->id)
        );
    }
}