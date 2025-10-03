<?php

namespace App\Http\Requests\softConfig\category;

use Illuminate\Foundation\Http\FormRequest;

class CreateCategoryRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:categories,name',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The category name is required.',
            'name.string' => 'The category name must be a string.',
            'name.max' => 'The category name cannot exceed 255 characters.',
            'name.unique' => 'This category name already exists.',

            'slug.string' => 'The category slug must be a string.',
            'slug.max' => 'The category slug cannot exceed 255 characters.',
            'slug.unique' => 'This category slug already exists.',

            'description.string' => 'The description must be valid text.',
        ];
    }
}
