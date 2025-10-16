<?php


namespace App\Services\softConfig;


use App\Models\softConfig\Brand;
use Illuminate\Support\Facades\Auth;

class BrandService
{
    public function getBrands(array $filters = [], $perPage = null)
    {
        $query = Brand::query()->select(
            'id',
            'name',
            'status',
            'created_by',
            'created_at',
            'deleted_at'
        );

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
            ->when($filters['created_by'] ?? null, fn($q, $createdBy) => $q->whereHas('createdBy', fn($sub) => $sub->where('name', 'like', "%{$createdBy}%")))
            ->when($filters['created_at'] ?? null, fn($q, $createdAt) => $q->whereDate('created_at', date('Y-m-d', strtotime($createdAt))))
            ->when($filters['search'] ?? null, fn($q, $term) => $q->where(function ($sub) use ($term) {
                $sub->where('name', 'like', "%{$term}%")
                    ->orWhereHas('createdBy', fn($user) => $user->where('name', 'like', "%{$term}%"));
            })
            );

        // Eager load common relations
        $query->with([
            'createdBy:id,name',
        ])->orderByDesc('id');

        // Return results
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
