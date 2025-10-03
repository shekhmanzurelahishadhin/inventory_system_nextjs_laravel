<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Requests\softConfig\category\CreateCategoryRequest;
use App\Http\Requests\softConfig\category\UpdateCategoryRequest;
use App\Http\Resources\softConfig\category\CategoryResource;
use App\Models\softConfig\Category;
use App\Services\softConfig\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, CategoryService $categoryService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search');

        $companies = $categoryService->getCompanies($filters, $perPage);

        if ($companies instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            // Paginated response
            return response()->json([
                'data' => CategoryResource::collection($companies->items()),
                'total' => $companies->total(),
                'current_page' => $companies->currentPage(),
                'per_page' => $companies->perPage(),
            ]);
        }

        // Collection response (no pagination)
        return response()->json([
            'data' => CategoryResource::collection($companies),
            'total' => $companies->count(),
            'current_page' => 1,
            'per_page' => $companies->count(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateCategoryRequest $request, CategoryService $categoryService)
    {
        $validatedData = $request->validated();

        $category = $categoryService->createCategory($validatedData);

        return response()->json([
            'message' => 'Category created successfully',
            'data' => new CategoryResource($category),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, CategoryService $categoryService, Category $category)
    {
//        dd($request);
        $category = $categoryService->updateCategory($category, $request->validated());

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => new CategoryResource($category),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // Soft delete (move to trash)
    public function trash(Category $category, CategoryService $categoryService)
    {
        $categoryService->softDeleteCategory($category);

        return response()->json([
            'message' => 'Category moved to trash successfully',
        ]);
    }

    // Restore soft-deleted category
    public function restore($id, CategoryService $categoryService)
    {
        $category = Category::withTrashed()->findOrFail($id);

        $category = $categoryService->restoreCategory($category);

        return response()->json([
            'message' => 'Category restored successfully',
            'data' => $category,
        ]);
    }

    // Force delete permanently
    public function destroy($id, CategoryService $categoryService)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $deleted = $categoryService->forceDeleteCategory($category);

        if ($deleted) {
            return response()->json([
                'message' => 'Category permanently deleted',
            ]);
        }

        return response()->json([
            'message' => 'Category is not in trash',
        ], 400);
    }
}
