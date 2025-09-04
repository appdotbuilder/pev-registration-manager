<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pev_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pev_id')->constrained()->onDelete('cascade');
            $table->foreignId('from_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('to_user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('to_email')->nullable()->comment('Email of new owner if not yet registered');
            $table->string('to_name')->nullable()->comment('Name of new owner if not yet registered');
            $table->string('to_phone')->nullable()->comment('Phone of new owner if not yet registered');
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable()->comment('Transfer notes or conditions');
            $table->timestamp('initiated_at');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index('pev_id');
            $table->index('from_user_id');
            $table->index('to_user_id');
            $table->index('status');
            $table->index(['pev_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pev_transfers');
    }
};