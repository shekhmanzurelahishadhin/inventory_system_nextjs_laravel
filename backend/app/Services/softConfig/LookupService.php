<?php


namespace App\Services\softConfig;


use App\Models\softConfig\Lookup;

class LookupService
{
    public function getLookups($filters = [], $perPage)
    {
        $query = Lookup::withTrashed();;

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%");
        }

        $query->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }
}
