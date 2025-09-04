<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PevController;
use App\Http\Controllers\PevTransferController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home page - PEV search functionality
Route::get('/', [HomeController::class, 'index'])->name('home');

// Dashboard (requires authentication)
Route::get('/dashboard', [HomeController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// PEV management routes (requires authentication)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('pevs', PevController::class);
    Route::resource('pev-transfers', PevTransferController::class);
});

// Profile routes are handled in auth.php

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';