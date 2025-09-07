<?php

namespace App\Http\Controllers\api\authorization;

use App\Http\Controllers\Controller;
use App\Http\Resources\authorization\PermissionRecource;
use Illuminate\Http\Request;
use App\Services\PermissionService;
class PermissionController extends Controller
{
    public function index(Request $request, PermissionService $permissionService)
    {
        $perPage = $request->get('per_page', 10);
        $filters = $request->only('search');

        $permissions = $permissionService->getPermission($filters, $perPage);

        return response()->json([
            'data' => PermissionRecource::collection($permissions),
            'total' => $permissions->total(),
            'current_page' => $permissions->currentPage(),
            'per_page' => $permissions->perPage(),
        ]);
    }
}
