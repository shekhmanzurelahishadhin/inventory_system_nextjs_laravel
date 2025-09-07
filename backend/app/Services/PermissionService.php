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
                ->orWhere('module_name', 'like', "%{$search}%")
                ->orWhere('menu_name', 'like', "%{$search}%")
                ->orWhere('subMenu_name', 'like', "%{$search}%");
        }

        return $query->with('module:id,name','menu:id,name','subMenu:id,name')->orderBy('id','desc')->paginate($perPage);
    }
}
