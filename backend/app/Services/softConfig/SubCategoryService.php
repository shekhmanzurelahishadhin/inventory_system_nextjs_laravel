<?php


namespace App\Services\softConfig;


use App\Models\softConfig\SubCategory;

class SubCategoryService
{
    public function getSubCategories($filters = [], $perPage)
    {
        $query = SubCategory::withTrashed();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%");
        }

        $query->with('category:id,name')->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }
}
