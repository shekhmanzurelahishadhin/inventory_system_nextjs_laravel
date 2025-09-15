<?php


namespace App\Services;


use Spatie\Permission\Models\Role;

class RoleService
{
    public function getRoles($filters = [], $perPage = 10)
    {
        $query = Role::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('guard_name', 'like', "%{$search}%");
        }

        return $query->orderBy('id','desc')->paginate($perPage);
    }

    public function createRole(array $data)
    {
        // Force guard_name to 'web' if not provided
        $data['guard_name'] = 'web';

        return Role::create($data);
    }

    public function updateRole($role, $data)
    {
        $role->update($data);
        return $role;
    }

    public function deleteRole($role)
    {
        return $role->delete();
    }
}
