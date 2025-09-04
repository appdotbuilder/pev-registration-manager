<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePevRequest;
use App\Http\Requests\UpdatePevRequest;
use App\Models\Pev;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PevController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Pev::with('owner')
            ->where('user_id', auth()->id())
            ->latest();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('make', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('vin', 'like', "%{$search}%")
                  ->orWhere('license_plate', 'like', "%{$search}%");
            });
        }

        $pevs = $query->paginate(10)->withQueryString();

        return Inertia::render('pevs/index', [
            'pevs' => $pevs,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('pevs/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePevRequest $request)
    {
        $pev = Pev::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('pevs.show', $pev)
            ->with('success', 'PEV registered successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pev $pev)
    {
        // Authorization check
        if ($pev->user_id !== auth()->id()) {
            abort(403, 'Unauthorized to view this PEV.');
        }

        $pev->load(['owner', 'transfers.fromUser', 'transfers.toUser']);

        return Inertia::render('pevs/show', [
            'pev' => $pev,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pev $pev)
    {
        // Authorization check
        if ($pev->user_id !== auth()->id()) {
            abort(403, 'Unauthorized to edit this PEV.');
        }

        return Inertia::render('pevs/edit', [
            'pev' => $pev,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePevRequest $request, Pev $pev)
    {
        $pev->update($request->validated());

        return redirect()->route('pevs.show', $pev)
            ->with('success', 'PEV information updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pev $pev)
    {
        // Authorization check
        if ($pev->user_id !== auth()->id()) {
            abort(403, 'Unauthorized to delete this PEV.');
        }

        $pev->delete();

        return redirect()->route('pevs.index')
            ->with('success', 'PEV registration deleted successfully.');
    }
}