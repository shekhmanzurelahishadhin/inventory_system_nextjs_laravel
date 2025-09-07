<?php


namespace App\Services;


use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function getPermission($filters = [], $perPage = 10)
    {
        $query = Permission::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('module', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('menu', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('subMenu', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        return $query->with(['module:id,name','menu:id,name','subMenu:id,name'])
            ->orderBy('id','desc')
            ->paginate($perPage);
    }
}
