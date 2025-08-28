<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'view-products',
            'create-products',
            'edit-products',
            'delete-products',
            'view-categories',
            'create-categories',
            'edit-categories',
            'delete-categories',
            'view-users',
            'create-users',
            'edit-users',
            'delete-users',
            'view-permissions',
            'create-permissions',
            'edit-permissions',
            'delete-permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $managerRole = Role::create(['name' => 'manager']);
        $managerRole->givePermissionTo([
            'view-products',
            'create-products',
            'edit-products',
            'view-categories',
            'create-categories',
            'edit-categories',
            'view-users',
        ]);

        $userRole = Role::create(['name' => 'user']);
        $userRole->givePermissionTo([
            'view-products',
            'view-categories',
        ]);
    }
}
