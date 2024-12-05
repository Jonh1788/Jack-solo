<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoinflipsTable extends Migration
{
    public function up()
    {
        Schema::create('coinflips', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('creator_id'); // User who created the coinflip
            $table->unsignedBigInteger('joiner_id')->nullable(); // User who joined the coinflip
            $table->decimal('amount', 15, 2); // Amount wagered
            $table->enum('status', ['pending', 'ongoing', 'completed'])->default('pending');
            $table->string('winner_side')->nullable(); // 'heads' or 'tails'
            $table->unsignedBigInteger('winner_id')->nullable(); // Winner's user ID
            $table->string('hash')->nullable(); // For fairness verification
            $table->string('creator_side')->default('heads');
            $table->string('joiner_side')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('coinflips');
    }
}