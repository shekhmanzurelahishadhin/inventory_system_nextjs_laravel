<?php

namespace App\Http\Requests\softConfig\company;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class CreateCompanyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        // auto-generate code if missing
        if (!$this->filled('code')) {
            $this->merge([
                'code' => generateCode('CMP', 'companies', 'code'),
            ]);
        }

        // auto-generate slug from name if missing
        if (!$this->filled('slug') && $this->filled('name')) {
            $this->merge([
                'slug' => Str::slug($this->input('name')),
            ]);
        }
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:companies,slug',
            'code' => 'required|string|max:50|unique:companies,code',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'default_currency' => 'nullable|string|max:10',
            'timezone' => 'nullable|string|max:50',
            'status' => 'boolean',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // max 2MB
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The company name is required.',
            'name.string'   => 'The company name must be a valid string.',
            'name.max'      => 'The company name cannot exceed 255 characters.',

            'slug.required'   => 'This slug is required.',
            'slug.unique'   => 'This company slug is already in use.',
            'slug.max'      => 'The slug cannot exceed 255 characters.',

            'code.required'   => 'This code is required.',
            'code.unique'   => 'This company code is already taken.',
            'code.max'      => 'The company code cannot exceed 50 characters.',

            'email.email'   => 'Please provide a valid email address.',
            'email.max'     => 'The email address cannot exceed 255 characters.',

            'phone.max'     => 'The phone number cannot exceed 50 characters.',

            'address.max'   => 'The address cannot exceed 500 characters.',

            'default_currency.max' => 'The currency code cannot exceed 10 characters.',
            'timezone.max'         => 'The timezone cannot exceed 50 characters.',

            'status.boolean' => 'The active status must be true or false.',

            'logo.image'   => 'The logo must be an image file.',
            'logo.mimes'   => 'The logo must be a file of type: jpeg, png, jpg, gif, svg.',
            'logo.max'     => 'The logo size may not be greater than 2MB.',
        ];
    }
}
