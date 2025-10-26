<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\authorization\RoleController;
use App\Http\Controllers\api\authorization\PermissionController;
use App\Http\Controllers\api\softConfig\CompanyController;
use App\Http\Controllers\api\softConfig\LookupController;
use App\Http\Controllers\api\softConfig\CategoryController;
use App\Http\Controllers\api\softConfig\SubCategoryController;
use App\Http\Controllers\api\softConfig\BrandController;
use App\Http\Controllers\api\softConfig\ProductModelController;
use App\Http\Controllers\api\softConfig\UnitController;
use App\Http\Controllers\api\softConfig\StoreController;
use App\Http\Controllers\api\softConfig\LocationController;
use App\Http\Controllers\api\purchase\SupplierController;
use App\Http\Controllers\api\sales\CustomerController;
use App\Http\Controllers\api\softConfig\ProductController;


Route::prefix('v1')->group(function () {
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
        Route::prefix('configure')->group(function () {

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

            // Lookups Route
            Route::prefix('lookups')->group(function () {
                Route::get('/', [LookupController::class, 'index']);
                Route::post('/', [LookupController::class, 'store']);
                Route::put('/{lookup}', [LookupController::class, 'update']);
                Route::post('trash/{lookup}', [LookupController::class, 'trash']); // soft delete
                Route::post('/restore/{id}', [LookupController::class, 'restore']);
                Route::delete('/{id}', [LookupController::class, 'destroy']); // force delete
            });
            Route::get('/get-lookup-type/lists', [LookupController::class, 'getLookupTypeLists']);
            Route::get('/get-lookup-list/{type}', [LookupController::class, 'getLookupListByType']);

            // Categories Route
            Route::prefix('categories')->group(function () {
                Route::get('/', [CategoryController::class, 'index']);
                Route::post('/', [CategoryController::class, 'store']);
                Route::get('/{category}', [CategoryController::class, 'show']);
                Route::put('/{category}', [CategoryController::class, 'update']);
                Route::post('trash/{category}', [CategoryController::class, 'trash']); // soft delete
                Route::post('/restore/{id}', [CategoryController::class, 'restore']);
                Route::delete('/{id}', [CategoryController::class, 'destroy']); // force delete
            });

            // Sub Categories Route
            Route::prefix('sub-categories')->group(function () {
                Route::get('/', [SubCategoryController::class, 'index']);
                Route::post('/', [SubCategoryController::class, 'store']);
                Route::get('/{subCategory}', [SubCategoryController::class, 'show']);
                Route::put('/{subCategory}', [SubCategoryController::class, 'update']);
                Route::post('trash/{subCategory}', [SubCategoryController::class, 'trash']); // soft delete
                Route::post('/restore/{id}', [SubCategoryController::class, 'restore']);
                Route::delete('/{id}', [SubCategoryController::class, 'destroy']); // force delete
            });

            // Brands Route
            Route::prefix('brands')->group(function () {
                Route::get('/', [BrandController::class, 'index']);
                Route::post('/', [BrandController::class, 'store']);
                Route::get('/{brand}', [BrandController::class, 'show']);
                Route::put('/{brand}', [BrandController::class, 'update']);
                Route::post('trash/{brand}', [BrandController::class, 'trash']); // soft delete
                Route::post('/restore/{id}', [BrandController::class, 'restore']);
                Route::delete('/{id}', [BrandController::class, 'destroy']); // force delete
            });

            // Models Route
            Route::prefix('models')->group(function () {
                Route::get('/', [ProductModelController::class, 'index']);
                Route::post('/', [ProductModelController::class, 'store']);
                Route::get('/{product_model}', [ProductModelController::class, 'show']);
                Route::put('/{product_model}', [ProductModelController::class, 'update']);
                Route::post('trash/{product_model}', [ProductModelController::class, 'trash']); // soft delete
                Route::post('/restore/{id}', [ProductModelController::class, 'restore']);
                Route::delete('/{id}', [ProductModelController::class, 'destroy']); // force delete
            });

            // Units Route
            Route::prefix('units')->group(function () {
                Route::get('/', [UnitController::class, 'index']);
                Route::post('/', [UnitController::class, 'store']);
                Route::get('/{unit}', [UnitController::class, 'show']);
                Route::put('/{unit}', [UnitController::class, 'update']);
                Route::post('trash/{unit}', [UnitController::class, 'trash']); // soft delete
                Route::post('/restore/{id}', [UnitController::class, 'restore']);
                Route::delete('/{id}', [UnitController::class, 'destroy']); // force delete
            });

            // Stores Route
            Route::prefix('stores')->group(function () {
                Route::get('/', [StoreController::class, 'index']);
                Route::post('/', [StoreController::class, 'store']);
                Route::get('/{store}', [StoreController::class, 'show']);
                Route::put('/{store}', [StoreController::class, 'update']);
                Route::post('trash/{store}', [StoreController::class, 'trash']); // soft delete
                Route::post('/restore/{id}', [StoreController::class, 'restore']);
                Route::delete('/{id}', [StoreController::class, 'destroy']); // force delete
            });
            // Stores Route
            Route::prefix('locations')->group(function () {
                Route::get('/', [LocationController::class, 'index']);
                Route::post('/', [LocationController::class, 'store']);
                Route::get('/{location}', [LocationController::class, 'show']);
                Route::put('/{location}', [LocationController::class, 'update']);
                Route::post('trash/{location}', [LocationController::class, 'trash']); // soft delete
                Route::post('/restore/{id}', [LocationController::class, 'restore']);
                Route::delete('/{id}', [LocationController::class, 'destroy']); // force delete
            });
            // Product Route
            Route::prefix('products')->group(function () {
                Route::get('/', [ProductController::class, 'index']);
                Route::post('/', [ProductController::class, 'store']);
                Route::get('/{product}', [ProductController::class, 'show']);
                Route::put('/{product}', [ProductController::class, 'update']);
                Route::post('trash/{product}', [ProductController::class, 'trash']); // soft delete
                Route::post('/restore/{id}', [ProductController::class, 'restore']);
                Route::delete('/{id}', [ProductController::class, 'destroy']); // force delete
            });
        });

        // Purchase Route
        Route::prefix('purchase')->group(function () {

            // Supplier Route
            Route::prefix('suppliers')->group(function () {
                Route::get('/', [SupplierController::class, 'index']);
                Route::post('/', [SupplierController::class, 'store']);
                Route::get('/{supplier}', [SupplierController::class, 'show']);
                Route::put('/{supplier}', [SupplierController::class, 'update']);
                Route::post('trash/{supplier}', [SupplierController::class, 'trash']); // soft delete
                Route::post('/restore/{id}', [SupplierController::class, 'restore']);
                Route::delete('/{id}', [SupplierController::class, 'destroy']); // force delete
            });
        });

        // Sales Route
        Route::prefix('sales')->group(function () {

            // Supplier Route
            Route::prefix('customers')->group(function () {
                Route::get('/', [CustomerController::class, 'index']);
                Route::post('/', [CustomerController::class, 'store']);
                Route::get('/{customer}', [CustomerController::class, 'show']);
                Route::put('/{customer}', [CustomerController::class, 'update']);
                Route::post('trash/{supplier}', [CustomerController::class, 'trash']); // soft delete
                Route::post('/restore/{id}', [CustomerController::class, 'restore']);
                Route::delete('/{id}', [CustomerController::class, 'destroy']); // force delete
            });
        });
    });

    Route::get('/test-cors', function () {
        return response()->json(['message' => 'CORS is working!']);
    });
});
