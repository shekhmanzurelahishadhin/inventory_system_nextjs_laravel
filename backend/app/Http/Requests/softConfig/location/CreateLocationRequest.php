<?php

namespace App\Http\Requests\softConfig\location;

use Illuminate\Foundation\Http\FormRequest;

class CreateLocationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'company_id' => 'required|exists:companies,id',
            'store_id' => 'required|exists:stores,id',
            'name' => 'required|string|max:255|unique:product_models,name',
            'description' => 'nullable|string',
        ];
    }
    public function messages(): array
    {
        return [
            'company_id.required' => 'Please select a company.',
            'company_id.exists' => 'The selected company is invalid.',

            'store_id.required' => 'Please select a store.',
            'store_id.exists' => 'The selected store is invalid.',

            'name.required' => 'Location name is required.',
            'name.unique' => 'This model name already exists.',
            'name.max' => 'Location name cannot be longer than 255 characters.',
            'description.string' => 'The description must be valid text.',
        ];
    }
}
