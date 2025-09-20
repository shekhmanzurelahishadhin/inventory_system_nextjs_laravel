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
        $perPage = $request->get('per_page'); // can be null
        $filters = $request->only('search');

        $roles = $roleService->getRoles($filters, $perPage);

        // Check if paginated
        if ($roles instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            return response()->json([
                'data' => RoleResource::collection($roles),
                'total' => $roles->total(),
                'current_page' => $roles->currentPage(),
                'per_page' => $roles->perPage(),
            ]);
        }

        // Not paginated, return all
        return response()->json([
            'data' => RoleResource::collection($roles),
            'total' => $roles->count(),
            'current_page' => 1,
            'per_page' => $roles->count(),
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

    // RoleController.php
    public function getPermissions($id)
    {
        $role = Role::findOrFail($id);
        return response()->json([
            'role' => $role,
            'permissions' => $role->permissions->pluck('name'),
        ]);
    }

    public function assignPermissions(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $permissions = $request->input('permissions', []);
        $role->syncPermissions($permissions);

        return response()->json(['message' => 'Permissions updated successfully']);
    }

}
