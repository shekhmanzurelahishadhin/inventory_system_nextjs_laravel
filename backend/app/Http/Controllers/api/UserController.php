<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
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
    public function users(Request $request)
    {
        $users = User::with('roles')->get();

        return response()->json([
            'users' => $users, // returns array of permission names
        ]);
    }
}
