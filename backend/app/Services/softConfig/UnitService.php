<?php


namespace App\Services\softConfig;


use App\Models\softConfig\Unit;

class UnitService
{
    public function getUnits($filters = [], $perPage)
    {
        $query = Unit::query();

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            $query->withTrashed();
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%");
        }

        $query->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function createUnit(array $data)
    {
        return Unit::create($data);
    }

    public function updateUnit(Unit $unit, array $data)
    {
        $unit->update($data); // updates the model
        return $unit;         // return the model itself
    }


    public function softDeleteUnit(Unit $unit)
    {
        $unit->delete();
    }

    public function restoreUnit(Unit $unit)
    {
        if ($unit->trashed()) {
            $unit->restore();
        }
        return $unit;
    }

    public function forceDeleteUnit(Unit $unit)
    {
        if ($unit->trashed()) {
            $unit->forceDelete();
            return true;
        }
        return false;
    }
}
