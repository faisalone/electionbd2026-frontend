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
        Schema::create('polls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Creator
            $table->text('question'); // Poll question
            $table->string('creator_name'); // Name of creator
            $table->dateTime('end_date'); // Poll end date and time
            $table->enum('status', ['active', 'ended'])->default('active');
            $table->integer('total_votes')->default(0);
            $table->string('winner_phone')->nullable(); // Selected winner's phone
            $table->dateTime('winner_selected_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('polls');
    }
};
