<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTermRequest;
use App\Http\Resources\TermResource;
use App\Models\Category;
use App\Models\Term;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TermController extends Controller
{
    /**
     * GET /api/terms
     * Query params:
     *   search   -> filtra pelo texto do termo (igual à busca de script.js)
     *   category -> filtra pelo slug da categoria (igual ao activeCategory)
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $termos = Term::query()
            ->with('category')
            ->search($request->query('search'))
            ->inCategory($request->query('category'))
            ->orderBy('term')
            ->get();

        return TermResource::collection($termos);
    }

    public function show(Term $term): TermResource
    {
        return new TermResource($term->load('category'));
    }

    public function store(StoreTermRequest $request): TermResource
    {
        $categoria = Category::where('slug', $request->validated('category'))->firstOrFail();

        $term = Term::create([
            'term' => $request->validated('term'),
            'translation' => $request->validated('translation'),
            'explanation' => $request->validated('explanation'),
            'category_id' => $categoria->id,
        ]);

        return new TermResource($term->load('category'));
    }

    public function update(StoreTermRequest $request, Term $term): TermResource
    {
        $categoria = Category::where('slug', $request->validated('category'))->firstOrFail();

        $term->update([
            'term' => $request->validated('term'),
            'translation' => $request->validated('translation'),
            'explanation' => $request->validated('explanation'),
            'category_id' => $categoria->id,
        ]);

        return new TermResource($term->load('category'));
    }

    public function destroy(Term $term)
    {
        $term->delete();

        return response()->json(null, 204);
    }
}
