<?php


namespace App\Services\softConfig;


use App\Models\softConfig\Category;

class CategoryService
{
    public function getCategories($filters = [], $perPage)
    {
        $query = Category::query();

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            $query->withTrashed();
        }


        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        $query->with(['productModels:id,name,category_id','subCategories:id,name,category_id'])->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function createCategory(array $data)
    {
        return Category::create($data);
    }

    public function updateCategory(Category $category, array $data)
    {
        $category->update($data); // updates the model
        return $category;         // return the model itself
    }


    public function softDeleteCategory(Category $category)
    {
        $category->delete();
    }

    public function restoreCategory(Category $category)
    {
        if ($category->trashed()) {
            $category->restore();
        }
        return $category;
    }

    public function forceDeleteCategory(Category $category)
    {
        if ($category->trashed()) {
            $category->forceDelete();
            return true;
        }
        return false;
    }
}
