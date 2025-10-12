<?php


namespace App\Services\softConfig;


use App\Models\softConfig\Category;

class CategoryService
{
    public function getCategories($filters = [], $perPage = null)
    {
        $query = Category::query();

        // Apply filters safely
        if (isset($filters['status']) && $filters['status'] !== '') {
            if($filters['status'] == 'trash'){;
                $query->onlyTrashed();
            }else{
                $query->where('status', $filters['status']);
            }
        }else {
            $query->withTrashed();
        }

        if (!empty($filters['name'])) {
            $query->where('name', 'like', "%{$filters['name']}%");
        }

        if (!empty($filters['description'])) {
            $query->where('description', 'like', "%{$filters['description']}%");
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $query->with([
            'productModels:id,name,category_id',
            'subCategories:id,name,category_id'
        ])->orderBy('id', 'desc');

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
