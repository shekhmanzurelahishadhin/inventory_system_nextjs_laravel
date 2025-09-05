<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\authorization\RoleController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'user']);

    //user manage routes
    Route::get('/users', [UserController::class, 'index']);

    //Roles manage routes
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
});

Route::get('/test-cors', function () {
    return response()->json(['message' => 'CORS is working!']);
});
