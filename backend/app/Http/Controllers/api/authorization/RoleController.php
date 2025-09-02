<?php

namespace App\Http\Controllers\api\authorization;

use App\Http\Controllers\Controller;
use App\Http\Resources\authoriziation\RoleResource;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $query = Role::query();

        // Optional search
        if ($request->has('search') && $request->search) {
            $search = $request->search;

            $query->where('name', 'like', "%{$search}%")
                ->orWhere('guard_name', 'like', "%{$search}%"); // optional
        }

        // Optional pagination
        $perPage = $request->get('per_page', 10);
        $roles = $query->paginate($perPage);

        // Return resource collection
        return response()->json([
            'data' => RoleResource::collection($roles),
            'total' => $roles->total(),
            'current_page' => $roles->currentPage(),
            'per_page' => $roles->perPage(),
        ]);
    }
}
