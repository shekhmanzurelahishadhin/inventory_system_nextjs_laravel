<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Requests\softConfig\subCategory\CreateSubCategoryRequest;
use App\Http\Requests\softConfig\subCategory\UpdateSubCategoryRequest;
use App\Http\Resources\softConfig\subCategory\SubCategoryResource;
use App\Models\softConfig\SubCategory;
use App\Services\softConfig\SubCategoryService;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:sub-category.create|sub-category.view|sub-category.edit|sub-category.delete')->only('index');
        $this->middleware('permission:sub-category.create')->only('store');
        $this->middleware('permission:sub-category.edit')->only('update');
        $this->middleware('permission:sub-category.delete')->only('destroy');
    }
    public function index(Request $request, SubCategoryService $subCategoryService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search','status','name','category_name','created_at','created_by');
        $categoryId = $request->query('category_id');

        $subCategories = $subCategoryService->getSubCategories($filters, $perPage, $categoryId);

        if ($subCategories instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            // Paginated response
            return response()->json([
                'data' => SubCategoryResource::collection($subCategories->items()),
                'total' => $subCategories->total(),
                'current_page' => $subCategories->currentPage(),
                'per_page' => $subCategories->perPage(),
            ]);
        }

        // Collection response (no pagination)
        return response()->json([
            'data' => SubCategoryResource::collection($subCategories),
            'total' => $subCategories->count(),
            'current_page' => 1,
            'per_page' => $subCategories->count(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateSubCategoryRequest $request, SubCategoryService $subCategoryService)
    {
        $validatedData = $request->validated();

        $subCategory  = $subCategoryService->createSubCategory($validatedData);

        return response()->json([
            'message' => 'SubCategory created successfully',
            'data' => new SubCategoryResource($subCategory),
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
    public function update(UpdateSubCategoryRequest $request, SubCategoryService $subCategoryService, SubCategory $subCategory)
    {
        $subCategory  = $subCategoryService->updateSubCategory($subCategory , $request->validated());

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => new SubCategoryResource($subCategory),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // Soft delete (move to trash)
    public function trash(SubCategory $subCategory , SubCategoryService $subCategoryService)
    {
        $subCategoryService->softDeleteSubCategory($subCategory);

        return response()->json([
            'message' => 'SubCategory moved to trash successfully',
        ]);
    }

    // Restore soft-deleted category
    public function restore($id, SubCategoryService $subCategoryService)
    {
        $subCategory  = SubCategory::withTrashed()->findOrFail($id);

        $subCategory  = $subCategoryService->restoreSubCategory($subCategory);

        return response()->json([
            'message' => 'SubCategory restored successfully',
            'data' => $subCategory ,
        ]);
    }

    // Force delete permanently
    public function destroy($id, SubCategoryService $subCategoryService)
    {
        $subCategory  = SubCategory::withTrashed()->findOrFail($id);
        $deleted = $subCategoryService->forceDeleteSubCategory($subCategory);

        if ($deleted) {
            return response()->json([
                'message' => 'SubCategory permanently deleted',
            ]);
        }

        return response()->json([
            'message' => 'SubCategory is not in trash',
        ], 400);
    }
}
