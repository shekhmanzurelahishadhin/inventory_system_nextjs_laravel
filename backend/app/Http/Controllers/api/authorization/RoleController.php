<?php

namespace App\Http\Controllers\api\authorization;

use App\Http\Controllers\Controller;
use App\Http\Requests\authorization\roles\CreateRoleRequest;
use App\Http\Requests\authorization\roles\UpdateRoleRequest;
use App\Http\Resources\authorization\RoleResource;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:role.create|role.view|role.edit|role.delete')->only('index');
        $this->middleware('permission:role.create')->only('store');
        $this->middleware('permission:role.edit')->only('update');
        $this->middleware('permission:role.delete')->only('destroy');
    }

    public function index(Request $request, RoleService $roleService)
    {
        $role = \Spatie\Permission\Models\Role::find(3);

//        dd([
//            'role_name' => $role->name,
//            'role_guard' => $role->guard_name,
//            'permissions' => $role->permissions->map(function ($permission) {
//                return [
//                    'name' => $permission->name,
//                    'guard' => $permission->guard_name,
//                ];
//            }),
//        ]);
//        $user->hasPermissionTo('role.view'); // true
//        $user->hasPermissionTo('user.edit'); // true
//        dd(auth()->user()->hasPermissionTo('user.edit'));


        $perPage = $request->get('per_page', 10);
        $filters = $request->only('search');

        $roles = $roleService->getRoles($filters, $perPage);
        $hasPermission = auth()->user()->getAllPermissions();
//        dd($hasPermission);
        return response()->json([
            'data' => RoleResource::collection($roles),
            'total' => $roles->total(),
            'current_page' => $roles->currentPage(),
            'per_page' => $roles->perPage(),
            'perm' => $hasPermission,
        ]);
    }

    public function store(CreateRoleRequest $request,  RoleService $roleService)
    {
        $role = $roleService->createRole($request->validated());

        return response()->json([
            'message' => 'Role created successfully',
            'data' => new RoleResource($role),
        ]);
    }

    public function update(UpdateRoleRequest $request, RoleService $roleService,  Role $role)
    {
        $updatedRole = $roleService->updateRole($role, $request->validated());

        return response()->json([
            'message' => 'Role updated successfully',
            'data' => new RoleResource($updatedRole),
        ]);
    }

    public function destroy(RoleService $roleService, Role $role)
    {
        $roleService->deleteRole($role);

        return response()->json([
            'message' => 'Role deleted successfully',
        ]);
    }
}
