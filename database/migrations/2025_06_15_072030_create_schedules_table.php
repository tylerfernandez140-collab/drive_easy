<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->nullable(); 
            $table->date('date');
            $table->string('time')->nullable();
            $table->foreignId('instructor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_registration_id')->nullable()->constrained()->onDelete('cascade'); 
            $table->string('location');
           $table->enum('exam_status', ['not_started', 'in_progress', 'completed', 'force_started'])->default('not_started');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
