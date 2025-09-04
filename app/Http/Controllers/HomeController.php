<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Pev;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page with PEV search functionality.
     */
    public function index(Request $request)
    {
        $results = null;

        // If user is authenticated, show their PEVs
        if (auth()->check()) {
            $userPevs = Pev::where('user_id', auth()->id())
                           ->active()
                           ->latest()
                           ->limit(5)
                           ->get();

            $totalPevs = Pev::where('user_id', auth()->id())->count();
            $activePevs = Pev::where('user_id', auth()->id())->active()->count();

            return Inertia::render('dashboard', [
                'userPevs' => $userPevs,
                'totalPevs' => $totalPevs,
                'activePevs' => $activePevs,
            ]);
        }

        // Public search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $searchType = $request->search_type ?? 'license_plate';

            $query = Pev::with('owner:id,name,email')
                        ->active();

            switch ($searchType) {
                case 'license_plate':
                    $query->where('license_plate', 'like', "%{$search}%");
                    break;
                case 'vin':
                    $query->where('vin', 'like', "%{$search}%");
                    break;
                case 'make_model':
                    $query->where(function ($q) use ($search) {
                        $q->where('make', 'like', "%{$search}%")
                          ->orWhere('model', 'like', "%{$search}%");
                    });
                    break;
            }

            $results = $query->limit(10)->get();
        }

        return Inertia::render('welcome', [
            'searchResults' => $results,
            'filters' => $request->only(['search', 'search_type']),
        ]);
    }
}