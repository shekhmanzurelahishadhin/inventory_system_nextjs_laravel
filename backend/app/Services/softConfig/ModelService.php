<?php


namespace App\Services\softConfig;


use App\Models\softConfig\ProductModel;

class ModelService
{
    public function getModels($filters = [], $perPage)
    {
        $query = ProductModel::query();

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            $query->withTrashed();
        }

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

        $query->with(['brand:id,name','category:id,name','subCategory:id,name'])->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function createModel(array $data)
    {
        return ProductModel::create($data);
    }

    public function updateModel(ProductModel $product_model, array $data)
    {
        $product_model->update($data); // updates the model
        return $product_model;         // return the model itself
    }


    public function softDeleteModel(ProductModel $product_model)
    {
        $product_model->delete();
    }

    public function restoreModel(ProductModel $product_model)
    {
        if ($product_model->trashed()) {
            $product_model->restore();
        }
        return $product_model;
    }

    public function forceDeleteModel(ProductModel $product_model)
    {
        if ($product_model->trashed()) {
            $product_model->forceDelete();
            return true;
        }
        return false;
    }
}
