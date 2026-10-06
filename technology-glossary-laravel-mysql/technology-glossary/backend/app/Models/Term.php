<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Term extends Model
{
    use HasFactory;

    protected $fillable = [
        'term',
        'translation',
        'explanation',
        'category_id',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * O front-end original (script.js) só pesquisava no campo "term"
     * (`t.term.toLowerCase().includes(q)`), não na explicação. Mantido
     * igual aqui para o comportamento da busca continuar idêntico.
     */
    public function scopeSearch(Builder $query, ?string $q): Builder
    {
        if (!$q) {
            return $query;
        }

        return $query->where('term', 'like', "%{$q}%");
    }

    /**
     * Filtra por categoria usando o slug (ex.: "programming"), do
     * mesmo jeito que activeCategory funcionava no front-end.
     */
    public function scopeInCategory(Builder $query, ?string $categorySlug): Builder
    {
        if (!$categorySlug || $categorySlug === 'all') {
            return $query;
        }

        return $query->whereHas('category', function (Builder $cat) use ($categorySlug) {
            $cat->where('slug', $categorySlug);
        });
    }
}
