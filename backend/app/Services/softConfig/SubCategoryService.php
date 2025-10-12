<?php


namespace App\Services\softConfig;


use App\Models\softConfig\SubCategory;

class SubCategoryService
{
    public function getSubCategories($filters = [], $perPage, $categoryId)
    {
        $query = SubCategory::query();

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            $query->withTrashed();
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('category', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }
        $query->with('category:id,name')->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function createSubCategory(array $data)
    {
        return SubCategory::create($data);
    }

    public function updateSubCategory(SubCategory $subCategory, array $data)
    {
        $subCategory->update($data); // updates the model
        return $subCategory;         // return the model itself
    }


    public function softDeleteSubCategory(SubCategory $subCategory)
    {
        $subCategory->delete();
    }

    public function restoreSubCategory(SubCategory $subCategory)
    {
        if ($subCategory->trashed()) {
            $subCategory->restore();
        }
        return $subCategory;
    }

    public function forceDeleteSubCategory(SubCategory $subCategory)
    {
        if ($subCategory->trashed()) {
            $subCategory->forceDelete();
            return true;
        }
        return false;
    }
}
