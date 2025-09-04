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
        Schema::create('pevs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('make')->comment('Vehicle manufacturer');
            $table->string('model')->comment('Vehicle model');
            $table->integer('year')->comment('Model year');
            $table->string('vin')->unique()->comment('Vehicle Identification Number');
            $table->string('license_plate')->unique()->comment('License plate number');
            $table->string('color')->nullable()->comment('Vehicle color');
            $table->decimal('battery_capacity', 8, 2)->nullable()->comment('Battery capacity in kWh');
            $table->integer('range_miles')->nullable()->comment('EPA estimated range in miles');
            $table->enum('status', ['active', 'inactive', 'transferred'])->default('active');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('make');
            $table->index('model');
            $table->index('year');
            $table->index('license_plate');
            $table->index('vin');
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pevs');
    }
};