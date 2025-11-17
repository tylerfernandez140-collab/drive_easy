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
        Schema::create('heroes', function (Blueprint $table) {
            $table->id();
            $table->string('icon_path')->nullable();
            $table->string('tagline')->nullable();
            $table->string('heading')->nullable();
            $table->string('highlight')->nullable();
            $table->text('description')->nullable();

            // Feature cards (3 only)
            $table->string('feature_one_title')->nullable();
            $table->text('feature_one_description')->nullable();

            $table->string('feature_two_title')->nullable();
            $table->text('feature_two_description')->nullable();

            $table->string('feature_three_title')->nullable();
            $table->text('feature_three_description')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('heroes');
    }
};
