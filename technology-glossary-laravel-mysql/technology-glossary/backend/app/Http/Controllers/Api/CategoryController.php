<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    /**
     * GET /api/categories
     * Usado para montar os "pills" de categoria em index.html e o
     * <select id="categoryInput"> em admin.html — substitui o array
     * fixo CATEGORIES que existia em data.js.
     */
    public function index(): AnonymousResourceCollection
    {
        $categorias = Category::orderBy('id')->get();

        return CategoryResource::collection($categorias);
    }
}
