<?php


namespace App\Services\softConfig;


use App\Models\softConfig\Brand;

class BrandService
{
    public function getCategories($filters = [], $perPage)
    {
        $query = Brand::withTrashed();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%");
        }

        $query->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }
}
