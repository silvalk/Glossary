<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Corresponde ao array INITIAL_TERMS que existia em data.js:
     *   { id: 1, term: "Algorithm", category: "programming", explanation: "..." }
     * "category_id" é a chave estrangeira (relação 1:N com categories).
     */
    public function up(): void
    {
        Schema::create('terms', function (Blueprint $table) {
            $table->id();
            $table->string('term', 120);
            $table->text('explanation');
            $table->foreignId('category_id')
                  ->constrained('categories')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
            $table->timestamps();

            $table->index('term');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('terms');
    }
};
