<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePevTransferRequest;
use App\Models\Pev;
use App\Models\PevTransfer;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PevTransferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transfers = PevTransfer::with(['pev', 'fromUser', 'toUser'])
            ->where(function ($query) {
                $query->where('from_user_id', auth()->id())
                      ->orWhere('to_user_id', auth()->id());
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('pev-transfers/index', [
            'transfers' => $transfers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $pevs = Pev::where('user_id', auth()->id())
                   ->where('status', 'active')
                   ->get(['id', 'make', 'model', 'year', 'license_plate']);

        $selectedPevId = $request->query('pev_id');

        return Inertia::render('pev-transfers/create', [
            'pevs' => $pevs,
            'selectedPevId' => $selectedPevId ? (int) $selectedPevId : null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePevTransferRequest $request)
    {
        $pev = Pev::findOrFail($request->pev_id);
        
        // Ensure the user owns this PEV
        if ($pev->user_id !== auth()->id()) {
            abort(403, 'Unauthorized to transfer this PEV.');
        }

        $transfer = PevTransfer::create([
            ...$request->validated(),
            'from_user_id' => auth()->id(),
            'initiated_at' => now(),
        ]);

        return redirect()->route('pev-transfers.show', $transfer)
            ->with('success', 'Transfer initiated successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(PevTransfer $pevTransfer)
    {
        // Authorization check
        if ($pevTransfer->from_user_id !== auth()->id() && $pevTransfer->to_user_id !== auth()->id()) {
            abort(403, 'Unauthorized to view this transfer.');
        }

        $pevTransfer->load(['pev', 'fromUser', 'toUser']);

        return Inertia::render('pev-transfers/show', [
            'transfer' => $pevTransfer,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PevTransfer $pevTransfer)
    {
        $request->validate([
            'action' => 'required|in:complete,cancel',
        ]);

        // Authorization check
        if ($pevTransfer->from_user_id !== auth()->id()) {
            abort(403, 'Only the transferring owner can update this transfer.');
        }

        if ($request->action === 'complete') {
            // Complete the transfer
            $pevTransfer->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Update PEV ownership if transferring to existing user
            if ($pevTransfer->to_user_id) {
                $pevTransfer->pev->update([
                    'user_id' => $pevTransfer->to_user_id,
                    'status' => 'active',
                ]);
            } else {
                // Mark PEV as transferred (pending new owner registration)
                $pevTransfer->pev->update([
                    'status' => 'transferred',
                ]);
            }

            $message = 'Transfer completed successfully!';
        } else {
            // Cancel the transfer
            $pevTransfer->update([
                'status' => 'cancelled',
            ]);

            $message = 'Transfer cancelled successfully.';
        }

        return redirect()->route('pev-transfers.show', $pevTransfer)
            ->with('success', $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PevTransfer $pevTransfer)
    {
        // Authorization check
        if ($pevTransfer->from_user_id !== auth()->id()) {
            abort(403, 'Unauthorized to delete this transfer.');
        }

        $pevTransfer->delete();

        return redirect()->route('pev-transfers.index')
            ->with('success', 'Transfer record deleted successfully.');
    }
}