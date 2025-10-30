<?php

namespace App\Http\Resources\softConfig\product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'brand_id' => $this->brand?->id ?? null,
            'brand_name' => $this->brand?->name ?? null,
            'category_id' => $this->category?->id ?? null,
            'category_name' => $this->category?->name ?? null,
            'sub_category_id' => $this->subCategory?->id ?? null,
            'sub_category_name' => $this->subCategory?->name ?? null,
            'model_id' => $this->productModel?->id ?? null,
            'model_name' => $this->productModel?->name ?? null,
            'unit_id' => $this->unit?->id ?? null,
            'unit_name' => $this->unit?->name ?? null,
            'slug' => $this->slug,
            'status' => $this->status,
            'purchase_price' => $this->purchase_price,
            'description' => $this->description,
            'selling_price' => $this->selling_price,
            'reorder_level' => $this->reorder_level,
            'created_by' => $this->createdBy?->name,
            'updated_by' => $this->updated_by,
            'deleted_by' => $this->deleted_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
