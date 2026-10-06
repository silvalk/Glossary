<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TermResource extends JsonResource
{
    /**
     * Formato idêntico ao antigo item de INITIAL_TERMS em data.js,
     * para que script.js/admin.js não precisem mudar a forma como
     * leem cada termo (item.id, item.term, item.category, item.explanation).
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'term' => $this->term,
            'translation' => $this->translation,
            'category' => $this->whenLoaded('category', fn () => $this->category->slug, $this->category_id),
            'explanation' => $this->explanation,
        ];
    }
}
