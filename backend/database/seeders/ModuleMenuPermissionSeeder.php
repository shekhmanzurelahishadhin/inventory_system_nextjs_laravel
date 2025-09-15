<?php

namespace Database\Seeders;

use App\Models\authorization\Menu;
use App\Models\authorization\Module;
use App\Models\authorization\SubMenu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class ModuleMenuPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Role
        $userRoleModule = Module::updateOrCreate(
            ['name' => 'User Role'],
            ['slug' => 'user-role']
        );
        $roleMenu = Menu::updateOrCreate(
            ['name' => 'Role', 'module_id' => $userRoleModule->id],
            ['slug' => 'role']
        );
//        $subMenu = SubMenu::updateOrCreate(
//            ['name' => 'Create', 'menu_id' => $menu->id],
//            ['slug' => 'create']
//        );
        Permission::updateOrCreate(
            ['name' => 'role.create', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $roleMenu->id,
                'sub_menu_id' => null,
            ]
        );
        Permission::updateOrCreate(
            ['name' => 'role.view', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $roleMenu->id,
                'sub_menu_id' => null,
            ]
        );
        Permission::updateOrCreate(
            ['name' => 'role.edit', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $roleMenu->id,
                'sub_menu_id' => null,
            ]
        );
        Permission::updateOrCreate(
            ['name' => 'role.delete', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $roleMenu->id,
                'sub_menu_id' => null,
            ]
        );
        Permission::updateOrCreate(
            ['name' => 'role.assign-permissions', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $roleMenu->id,
                'sub_menu_id' => null,
            ]
        );


        // Permission

        $permissionMenu = Menu::updateOrCreate(
            ['name' => 'Permission', 'module_id' => $userRoleModule->id],
            ['slug' => 'permission']
        );
        Permission::updateOrCreate(
            ['name' => 'permission.create', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $permissionMenu->id,
                'sub_menu_id' => null,
            ]
        );
        Permission::updateOrCreate(
            ['name' => 'permission.view', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $permissionMenu->id,
                'sub_menu_id' => null,
            ]
        );
        Permission::updateOrCreate(
            ['name' => 'permission.edit', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $permissionMenu->id,
                'sub_menu_id' => null,
            ]
        );
        Permission::updateOrCreate(
            ['name' => 'permission.delete', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $permissionMenu->id,
                'sub_menu_id' => null,
            ]
        );

        // User

        $userMenu = Menu::updateOrCreate(
            ['name' => 'User', 'module_id' => $userRoleModule->id],
            ['slug' => 'user']
        );
//        $userSubMenu = SubMenu::updateOrCreate(
//            ['name' => 'Manage User', 'module_id' => $userRoleModule->id, 'menu_id' => $userMenu->id],
//            ['slug' => 'manage-user']
//        );
        Permission::updateOrCreate(
            ['name' => 'user.create', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $userMenu->id,
                'sub_menu_id' => null,
            ]
        );
        Permission::updateOrCreate(
            ['name' => 'user.view', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $userMenu->id,
                'sub_menu_id' => null,
            ]
        );
        Permission::updateOrCreate(
            ['name' => 'user.edit', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $userMenu->id,
                'sub_menu_id' => null,
            ]
        );
        Permission::updateOrCreate(
            ['name' => 'user.delete', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $userMenu->id,
                'sub_menu_id' => null,
            ]
        );
        Permission::updateOrCreate(
            ['name' => 'user.assign-permissions', 'guard_name' => 'web'],
            [
                'module_id'   => $userRoleModule->id,
                'menu_id'     => $userMenu->id,
                'sub_menu_id' => null,
            ]
        );
    }
}
