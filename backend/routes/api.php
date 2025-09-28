<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\authorization\RoleController;
use App\Http\Controllers\api\authorization\PermissionController;
use App\Http\Controllers\api\softConfig\CompanyController;
use App\Http\Controllers\api\softConfig\LookupController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'user']);

    //user manage routes
    Route::prefix('users')->group(function () {
        // User management
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{user}', [UserController::class, 'update']);
        Route::delete('/{user}', [UserController::class, 'destroy']);

        // User permissions
        Route::get('/{user}/permissions', [UserController::class, 'getUserPermissions']);
        Route::post('/{user}/permissions', [UserController::class, 'assignPermissions']);
    });

    //Roles manage routes
    Route::prefix('roles')->group(function () {
        // Role Management
        Route::get('/', [RoleController::class, 'index']);       // list roles
        Route::post('/', [RoleController::class, 'store']);      // create role
        Route::put('/{role}', [RoleController::class, 'update']); // update role
        Route::delete('/{role}', [RoleController::class, 'destroy']); // delete role

        // Role permission
        Route::get('/{role}/permissions', [RoleController::class, 'getPermissions']); // fetch assigned
        Route::post('/{role}/permissions', [RoleController::class, 'assignPermissions']); // assign/update
    });

    //Permission manage routes
    Route::prefix('permissions')->group(function () {
        Route::get('/', [PermissionController::class, 'index']);
        Route::post('/', [PermissionController::class, 'store']);
        Route::put('/{permission}', [PermissionController::class, 'update']);
        Route::delete('/{permission}', [PermissionController::class, 'destroy']);
    });

    // Permission Module, Menu and Sub Menu
    Route::get('/modules', [PermissionController::class, 'modules']);
    Route::get('/menus', [PermissionController::class, 'menus']);
    Route::get('/sub-menus', [PermissionController::class, 'subMenus']);


    // Soft Config Route
    Route::prefix('soft-config')->group(function () {

        // Companies Route
        Route::prefix('companies')->group(function () {
            Route::get('/', [CompanyController::class, 'index']);
            Route::post('/', [CompanyController::class, 'store']);
            Route::get('/{company}', [CompanyController::class, 'show']);
            Route::put('/{company}', [CompanyController::class, 'update']);
            Route::post('trash/{company}', [CompanyController::class, 'trash']); // soft delete
            Route::post('/restore/{id}', [CompanyController::class, 'restore']);
            Route::delete('/{id}', [CompanyController::class, 'destroy']); // force delete
        });

        //------------------------------------lookup start-------------------------------------------------
        Route::prefix('lookups')->group(function () {
            Route::get('/', [LookupController::class, 'index']);
            Route::post('/', [LookupController::class, 'store']);
            Route::put('/{lookup}', [LookupController::class, 'update']);
            Route::delete('/{lookup}', [LookupController::class, 'destroy']);
        });
        Route::get('/get-lookup/lists', [LookupController::class, 'getLookupLists']);

        //------------------------------------lookup end-----------------------------------------------------
    });
});

Route::get('/test-cors', function () {
    return response()->json(['message' => 'CORS is working!']);
});
