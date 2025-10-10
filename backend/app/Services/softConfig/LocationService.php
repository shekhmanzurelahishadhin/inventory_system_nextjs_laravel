<?php


namespace App\Services\softConfig;


use App\Models\softConfig\Location;

class LocationService
{
    public function getLocations($filters = [], $perPage, $companyId, $storeId)
    {
        $query = Location::query();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status'] ? 1 : 0);
        } else {
            $query->withTrashed();
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('store', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('company', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }
        if ($companyId) {
            $query->where('company_id', $companyId);
        }
        if ($storeId) {
            $query->where('store_id', $storeId);
        }
        $query->with(['store:id,name','company:id,name'])->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }
}
