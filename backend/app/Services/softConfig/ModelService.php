<?php


namespace App\Services\softConfig;


use App\Models\softConfig\ProductModel;

class ModelService
{
    public function getModels($filters = [], $perPage)
    {
        $query = ProductModel::withTrashed();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('brand', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('category', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('subCategory', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        $query->with('brand:id,name')->with('category:id,name')->with('subCategory:id,name')->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }
}
