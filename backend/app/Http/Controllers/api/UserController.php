<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function user(Request $request)
    {
        $user = Auth::user();

        return response()->json([
            'user' => $user,
            'roles' => $user->getRoleNames(), // returns array of role names
            'permissions' => $user->getAllPermissions()->pluck('name'), // returns array of permission names
        ]);
    }
}
