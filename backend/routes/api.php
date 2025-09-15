<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\authorization\RoleController;
use App\Http\Controllers\api\authorization\PermissionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'user']);

    //user manage routes
    Route::get('/users', [UserController::class, 'index']);
    // User permissions routes
    Route::get('/users/{user}/permissions', [UserController::class, 'getUserPermissions']);
    Route::post('/users/{user}/permissions', [UserController::class, 'assignPermissions']);

    //Roles manage routes
    Route::prefix('roles')->group(function () {
        // CRUD
        Route::get('/', [RoleController::class, 'index']);       // list roles
        Route::post('/', [RoleController::class, 'store']);      // create role
        Route::put('/{role}', [RoleController::class, 'update']); // update role
        Route::delete('/{role}', [RoleController::class, 'destroy']); // delete role

        // Extra
        Route::get('/{role}/permissions', [RoleController::class, 'getPermissions']); // fetch assigned
        Route::post('/{role}/permissions', [RoleController::class, 'assignPermissions']); // assign/update
    });

    //Roles manage routes
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::post('/permissions', [PermissionController::class, 'store']);
    Route::put('/permissions/{permission}', [PermissionController::class, 'update']);
    Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy']);

    Route::get('/modules', [PermissionController::class, 'modules']);
    Route::get('/menus', [PermissionController::class, 'menus']);
    Route::get('/sub-menus', [PermissionController::class, 'subMenus']);
});

Route::get('/test-cors', function () {
    return response()->json(['message' => 'CORS is working!']);
});
