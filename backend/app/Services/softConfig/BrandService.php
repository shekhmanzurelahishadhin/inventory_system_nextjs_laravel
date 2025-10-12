<?php


namespace App\Services\softConfig;


use App\Models\softConfig\Brand;

class BrandService
{
    public function getBrands($filters = [], $perPage)
    {
        $query = Brand::query();

        // Apply "status" filter if passed
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            $query->withTrashed();
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%");
        }

        $query->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function createBrand(array $data)
    {
        return Brand::create($data);
    }

    public function updateBrand(Brand $brand, array $data)
    {
        $brand->update($data); // updates the model
        return $brand;         // return the model itself
    }


    public function softDeleteBrand(Brand $brand)
    {
        $brand->delete();
    }

    public function restoreBrand(Brand $brand)
    {
        if ($brand->trashed()) {
            $brand->restore();
        }
        return $brand;
    }

    public function forceDeleteBrand(Brand $brand)
    {
        if ($brand->trashed()) {
            $brand->forceDelete();
            return true;
        }
        return false;
    }
}
