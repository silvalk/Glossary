<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Corresponde ao array CATEGORIES que existia em data.js:
     *   { id: "programming", label: "Programming", icon: "code" }
     * "slug" guarda o mesmo texto que era usado como "id" no front-end
     * (ex.: "programming", "web", "ai"...), para que script.js e admin.js
     * continuem funcionando sem precisar mudar a lógica de getCategory().
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 40)->unique();
            $table->string('label', 100);
            $table->string('icon', 40);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
