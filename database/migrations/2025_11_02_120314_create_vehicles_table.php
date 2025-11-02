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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Ex: "MC-01", "CAR-MATIC-01"
            $table->string('type'); // Ex: "motorcycle", "motorcycle_sidecar", "car_manual", "car_matic"
            $table->string('plate_number')->nullable(); // optional field for record tracking
            $table->string('status')->default('available'); // available, maintenance, inactive, etc.
            $table->boolean('active')->default(true); // for soft disabling without deleting
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
