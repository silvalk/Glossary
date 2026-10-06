<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Adiciona a tradução em português do termo (ex.: "Browser" -> "Navegador"),
     * exibida logo abaixo da palavra em inglês nos cards e no admin.
     */
    public function up(): void
    {
        Schema::table('terms', function (Blueprint $table) {
            $table->string('translation', 150)->after('term')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('terms', function (Blueprint $table) {
            $table->dropColumn('translation');
        });
    }
};
