<?php


namespace App\Services\softConfig;


use App\Models\softConfig\Store;

class StoreService
{
    public function getStores($filters = [], $perPage, $companyId)
    {
        $query = Store::withTrashed();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('company', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }
        if ($companyId) {
            $query->where('company_id', $companyId);
        }
        $query->with('company:id,name')->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function createStore(array $data)
    {
        $data['code'] = generateCode('STR', 'stores', 'code');
        return Store::create($data);
    }

    public function updateStore(Store $subCategory, array $data)
    {
        $data['code'] = generateCode('STR', 'stores', 'code');
        $subCategory->update($data); // updates the model
        return $subCategory;         // return the model itself
    }


    public function softDeleteStore(Store $subCategory)
    {
        $subCategory->delete();
    }

    public function restoreStore(Store $subCategory)
    {
        if ($subCategory->trashed()) {
            $subCategory->restore();
        }
        return $subCategory;
    }

    public function forceDeleteStore(Store $subCategory)
    {
        if ($subCategory->trashed()) {
            $subCategory->forceDelete();
            return true;
        }
        return false;
    }
}
