<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:user.create|user.view|user.edit|user.delete')->only('index');
        $this->middleware('permission:user.create')->only('store');
        $this->middleware('permission:user.edit')->only('update');
        $this->middleware('permission:user.delete')->only('destroy');
    }
    public function user(Request $request)
    {
        $user = Auth::user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'roles' => $user->getRoleNames(), // returns array of role names
            'permissions' => $user->getAllPermissions()->pluck('name'), // returns array of permission names
        ]);
    }
    public function index(Request $request)
    {
        $query = User::with('roles:id,name');

        // Optional search
        if ($request->has('search') && $request->search) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('roles', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Optional pagination
        $perPage = $request->get('per_page');
        $users = $query->paginate($perPage);

        // Return resource collection
        return response()->json([
            'data' => UserResource::collection($users),
            'total' => $users->total(),
            'current_page' => $users->currentPage(),
            'per_page' => $users->perPage(),
        ]);
    }

    public function getUserPermissions(User $user)
    {
        // Return user with their direct permissions
        return response()->json([
            'user' => $user,
            'permissions' => $user->getDirectPermissions()->pluck('name')
        ]);
    }

    /**
     * Assign direct permissions to user
     */
    public function assignPermissions(Request $request, User $user)
    {

        try {
            // Get permission models from permission names
            $permissions = Permission::whereIn('name', $request->permissions)->get();

            // Sync permissions - this automatically handles revoking and granting
            $user->syncPermissions($permissions);

            return response()->json([
                'message' => 'Permissions synchronized successfully',
                'user' => $user->only(['id', 'name', 'email']),
                'permissions' => $user->getDirectPermissions()->pluck('name')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to assign permissions',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
