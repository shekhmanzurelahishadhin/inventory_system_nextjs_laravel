<?php


namespace App\Services\softConfig;


use App\Models\softConfig\Product;
use function Symfony\Component\Console\Style\tree;

class ProductService
{
    public function getProducts(array $filters = [], $perPage = null, $categoryId = null, $subCategoryId = null, $brandId = null, $modelId = null)
    {
        $query = Product::query()->select(
            'id',
            'name',
            'code',
            'brand_id',
            'category_id',
            'sub_category_id',
            'model_id',
            'unit_id',
            'purchase_price',
            'selling_price',
            'reorder_level',
            'description',
            'status',
            'created_by',
            'created_at',
            'deleted_at'
        );

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }
        if ($subCategoryId) {
            $query->where('sub_category_id', $subCategoryId);
        }
        if ($brandId) {
            $query->where('brand_id', $brandId);
        }
        if ($modelId) {
            $query->where('model_id', $modelId);
        }
        // Handle status / trash logic
        if (($filters['status'] ?? '') === 'trash') {
            $query->onlyTrashed();
        } elseif (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', $filters['status']);
        } else {
            $query->withTrashed();
        }

        // Apply filters
        $query
            ->when($filters['name'] ?? null, fn($q, $name) => $q->where('name', 'like', "%{$name}%"))
            ->when($filters['code'] ?? null, fn($q, $code) => $q->where('code', 'like', "%{$code}%"))
            ->when($filters['purchase_price'] ?? null, fn($q, $purchase_price) => $q->where('purchase_price', 'like', "%{$purchase_price}%"))
            ->when($filters['selling_price'] ?? null, fn($q, $selling_price) => $q->where('selling_price', 'like', "%{$selling_price}%"))
            ->when($filters['reorder_level'] ?? null, fn($q, $reorder_level) => $q->where('reorder_level', 'like', "%{$reorder_level}%"))
            ->when($filters['created_by'] ?? null, fn($q, $createdBy) => $q->whereHas('createdBy', fn($sub) => $sub->where('name', 'like', "%{$createdBy}%")))
            ->when($filters['category_name'] ?? null, fn($q, $category) => $q->whereHas('category', fn($cat) => $cat->where('name', 'like', "%{$category}%")))
            ->when($filters['sub_category_name'] ?? null, fn($q, $sub_category) => $q->whereHas('subCategory', fn($subCat) => $subCat->where('name', 'like', "%{$sub_category}%")))
            ->when($filters['brand_name'] ?? null, fn($q, $brand) => $q->whereHas('brand', fn($str) => $str->where('name', 'like', "%{$brand}%")))
            ->when($filters['model_name'] ?? null, fn($q, $model) => $q->whereHas('productModel', fn($str) => $str->where('name', 'like', "%{$model}%")))
            ->when($filters['unit_name'] ?? null, fn($q, $unit) => $q->whereHas('unit', fn($str) => $str->where('name', 'like', "%{$unit}%")))
            ->when($filters['created_at'] ?? null, fn($q, $createdAt) => $q->whereDate('created_at', date('Y-m-d', strtotime($createdAt))))
            ->when($filters['search'] ?? null, fn($q, $term) => $q->where(function ($sub) use ($term) {
                $sub->where('name', 'like', "%{$term}%")
                    ->orWhere('code', 'like', "%{$term}%")
                    ->orWhere('purchase_price', 'like', "%{$term}%")
                    ->orWhere('selling_price', 'like', "%{$term}%")
                    ->orWhere('reorder_level', 'like', "%{$term}%")
                    ->orWhereHas('category', fn($category) => $category->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('subCategory', fn($sub_category) => $sub_category->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('brand', fn($brand) => $brand->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('unit', fn($unit) => $unit->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('productModel', fn($model) => $model->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('createdBy', fn($user) => $user->where('name', 'like', "%{$term}%"));
            })
            );

        // Eager load common relations
        $query->with([
            'createdBy:id,name',
            'category:id,name',
            'subCategory:id,name',
            'brand:id,name',
            'unit:id,name',
            'productModel:id,name',
        ])->orderByDesc('id');

        // Return results
        return $perPage ? $query->paginate($perPage) : $query->get();
    }
    public function createProduct(array $data)
    {
        $data['code'] = generateComplexCode('PRD', 'products', 'code',true);

        return Product::create($data);
    }

    public function updateProduct(Product $product, array $data)
    {
        $product->update($data);
        return $product;
    }

    public function softDeleteProduct(Product $product)
    {
        $product->delete();
    }

    public function restoreProduct(Product $product)
    {
        if ($product->trashed()) {
            $product->restore();
        }
        return $product;
    }

    public function forceDeleteProduct(Product $product)
    {
        if ($product->trashed()) {
            $product->forceDelete();
            return true;
        }
        return false;
    }

}
