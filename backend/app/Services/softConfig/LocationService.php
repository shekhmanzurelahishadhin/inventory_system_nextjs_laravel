<?php


namespace App\Services\softConfig;


use App\Models\softConfig\Location;

class LocationService
{
    public function getLocations($filters = [], $perPage, $companyId, $storeId)
    {
        $query = Location::query();

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
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

    public function createLocation(array $data)
    {
        $data['code'] = generateCode('LOC', 'locations', 'code');
        return Location::create($data);
    }

    public function updateLocation(Location $location, array $data)
    {
        $location->update($data); // updates the model
        return $location;         // return the model itself
    }


    public function softDeleteLocation(Location $location)
    {
        $location->delete();
    }

    public function restoreLocation(Location $location)
    {
        if ($location->trashed()) {
            $location->restore();
        }
        return $location;
    }

    public function forceDeleteLocation(Location $location)
    {
        if ($location->trashed()) {
            $location->forceDelete();
            return true;
        }
        return false;
    }
}
