<?php

namespace App\Http\Controllers\api\authorization;

use App\Http\Controllers\Controller;
use App\Http\Requests\authorization\permission\CreatePermissionRequest;
use App\Http\Resources\authorization\PermissionRecource;
use App\Models\authorization\Menu;
use App\Models\authorization\Module;
use App\Models\authorization\SubMenu;
use Illuminate\Http\Request;
use App\Services\PermissionService;
class PermissionController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:permission.create|permission.view|permission.edit|permission.delete')->only('index');
        $this->middleware('permission:permission.create')->only('store');
        $this->middleware('permission:permission.edit')->only('update');
        $this->middleware('permission:permission.delete')->only('destroy');
    }

    public function index(Request $request, PermissionService $permissionService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search');

        $permissions = $permissionService->getPermission($filters, $perPage);

        return response()->json([
            'data' => PermissionRecource::collection($permissions),
            'total' => $permissions->total(),
            'current_page' => $permissions->currentPage(),
            'per_page' => $permissions->perPage(),
        ]);
    }
    public function store(CreatePermissionRequest $request,  PermissionService $permissionService)
    {
        $permission = $permissionService->createPermission($request->validated());

        return response()->json([
            'message' => 'Role created successfully',
            'data' => new PermissionRecource($permission),
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
    public function modules()
    {
        return response()->json(Module::select('id', 'name')->get());
    }

    public function menus(Request $request)
    {
        $moduleId = $request->query('module_id');

        $query = Menu::select('id', 'name', 'module_id');

        if ($moduleId) {
            $query->where('module_id', $moduleId);
        }

        return response()->json($query->get());
    }
    public function subMenus(Request $request)
    {
        $menuId = $request->query('menu_id');

        $query = SubMenu::select('id', 'name', 'menu_id');

        if ($menuId) {
            $query->where('menu_id', $menuId);
        }

        return response()->json($query->get());
    }

}
