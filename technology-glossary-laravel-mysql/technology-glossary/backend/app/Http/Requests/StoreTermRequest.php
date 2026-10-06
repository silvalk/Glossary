<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTermRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Sem autenticação real ainda — ver observações de segurança no README.
        return true;
    }

    public function rules(): array
    {
        $termId = $this->route('term')?->id;

        return [
            'term' => [
                'required', 'string', 'max:120',
                Rule::unique('terms', 'term')->ignore($termId),
            ],
            'translation' => ['required', 'string', 'max:150'],
            'explanation' => ['required', 'string'],
            // "category" chega como slug (ex.: "programming"), igual ao
            // <select id="categoryInput"> do admin.html original.
            'category' => ['required', 'string', Rule::exists('categories', 'slug')],
        ];
    }

    public function messages(): array
    {
        return [
            'term.required' => 'O termo é obrigatório.',
            'term.unique' => 'Este termo já está cadastrado.',
            'translation.required' => 'A tradução em português é obrigatória.',
            'explanation.required' => 'A explicação é obrigatória.',
            'category.required' => 'Selecione uma categoria.',
            'category.exists' => 'A categoria selecionada não existe.',
        ];
    }
}
