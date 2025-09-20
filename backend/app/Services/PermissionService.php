<?php


namespace App\Services;


use App\Models\authorization\PermissionModel;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function getPermission($filters = [], $perPage)
    {
        $query = PermissionModel::query();

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

        $query->with(['module:id,name','menu:id,name','subMenu:id,name'])
            ->orderBy('id', 'desc');

        // If perPage is provided, paginate; otherwise return all
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function createPermission(array $data)
    {
        // Force guard_name to 'web' if not provided
        $data['guard_name'] = 'web';

        return Permission::create($data);
    }

    public function updatePermission($permission, $data)
    {

        $data = collect($data)->except(['created_at'])->toArray();

        $permission->update($data);

        return $permission;
    }
    public function deletePermission($permission)
    {
        return $permission->delete();
    }
}
