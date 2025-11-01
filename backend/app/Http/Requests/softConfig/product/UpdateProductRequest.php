<?php

namespace App\Http\Requests\softConfig\product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
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
        $productId = $this->route('product'); // assuming route like /products/{product}

        return [
            'category_id'      => 'required|exists:categories,id',
            'sub_category_id'  => 'nullable|exists:sub_categories,id',
            'brand_id'         => 'nullable|exists:brands,id',
            'model_id'         => 'nullable|exists:product_models,id',
            'unit_id'          => 'required|exists:units,id',

            'name'             => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'name')->ignore($productId),
            ],
            'slug'             => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('products', 'slug')->ignore($productId),
            ],
            'code'             => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products', 'code')->ignore($productId),
            ],
            'description'      => 'nullable|string',

            'purchase_price'   => 'required|numeric|min:0',
            'selling_price'    => 'required|numeric|min:0',
            'reorder_level'    => 'nullable|numeric|min:0',
            'status' => 'boolean',
        ];
    }

    /**
     * Custom messages for validation.
     */
    public function messages(): array
    {
        return [
            'category_id.required'     => 'Please select a category.',
            'category_id.exists'       => 'Selected category is invalid.',
            'unit_id.required'         => 'Please select a unit.',
            'unit_id.exists'           => 'Selected unit is invalid.',

            'name.required'            => 'Product name is required.',
            'name.unique'              => 'This product name already exists.',
            'code.unique'              => 'This product code already exists.',

            'purchase_price.required'  => 'Please enter a purchase price.',
            'purchase_price.numeric'   => 'Purchase price must be a number.',
            'selling_price.required'   => 'Please enter a selling price.',

            'reorder_level.numeric'    => 'Reorder level must be numeric.',
            'status.boolean' => 'The active status must be true or false.',
        ];
    }
}
