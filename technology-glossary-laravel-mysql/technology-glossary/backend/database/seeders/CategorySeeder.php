<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Mesmas 6 categorias que estavam hard-coded no array CATEGORIES
     * de data.js (slug/label/icon preservados exatamente).
     */
    public function run(): void
    {
        $categorias = [
            ['slug' => 'programming', 'label' => 'Programming',        'icon' => 'code'],
            ['slug' => 'web',         'label' => 'Web & Internet',     'icon' => 'globe'],
            ['slug' => 'ai',          'label' => 'AI & Data',          'icon' => 'brain'],
            ['slug' => 'hardware',    'label' => 'Hardware',           'icon' => 'cpu'],
            ['slug' => 'security',    'label' => 'Security',           'icon' => 'shield'],
            ['slug' => 'systems',     'label' => 'Software & Systems', 'icon' => 'layers'],
        ];

        foreach ($categorias as $dados) {
            Category::updateOrCreate(['slug' => $dados['slug']], $dados);
        }
    }
}
