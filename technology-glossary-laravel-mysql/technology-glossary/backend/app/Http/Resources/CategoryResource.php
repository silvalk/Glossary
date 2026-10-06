<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Formato idêntico ao antigo item de CATEGORIES em data.js:
     * { id: "programming", label: "Programming", icon: "code" }.
     * "id" aqui é o slug (não o id numérico da tabela), de propósito,
     * porque é isso que getCategory()/item.category comparam no front-end.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->slug,
            'label' => $this->label,
            'icon' => $this->icon,
        ];
    }
}
