<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Requests\softConfig\brand\CreateBrandRequest;
use App\Http\Requests\softConfig\brand\UpdateBrandRequest;
use App\Http\Resources\softConfig\brand\BrandResource;
use App\Models\softConfig\Brand;
use App\Services\softConfig\BrandService;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:brand.create|brand.view|brand.edit|brand.delete')->only('index');
        $this->middleware('permission:brand.create')->only('store');
        $this->middleware('permission:brand.edit')->only('update');
        $this->middleware('permission:brand.delete')->only('destroy');
    }

    public function index(Request $request, BrandService $brandService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search','status','name','created_at','created_by');

        $brands = $brandService->getBrands($filters, $perPage);

        if ($brands instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            // Paginated response
            return response()->json([
                'data' => BrandResource::collection($brands->items()),
                'total' => $brands->total(),
                'current_page' => $brands->currentPage(),
                'per_page' => $brands->perPage(),
            ]);
        }

        // Collection response (no pagination)
        return response()->json([
            'data' => BrandResource::collection($brands),
            'total' => $brands->count(),
            'current_page' => 1,
            'per_page' => $brands->count(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateBrandRequest $request, BrandService $brandService)
    {
        $validatedData = $request->validated();

        $brand = $brandService->createBrand($validatedData);

        return response()->json([
            'message' => 'Brand created successfully',
            'data' => new BrandResource($brand),
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
    public function update(UpdateBrandRequest $request, BrandService $brandService, Brand $brand)
    {

        $brand = $brandService->updateBrand($brand, $request->validated());

        return response()->json([
            'message' => 'Brand updated successfully',
            'data' => new BrandResource($brand),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // Soft delete (move to trash)
    public function trash(Brand $brand, BrandService $brandService)
    {
        $brandService->softDeleteBrand($brand);

        return response()->json([
            'message' => 'Brand moved to trash successfully',
        ]);
    }

    // Restore soft-deleted brand
    public function restore($id, BrandService $brandService)
    {
        $brand = Brand::withTrashed()->findOrFail($id);

        $brand = $brandService->restoreBrand($brand);

        return response()->json([
            'message' => 'Brand restored successfully',
            'data' => $brand,
        ]);
    }

    // Force delete permanently
    public function destroy($id, BrandService $brandService)
    {
        $brand = Brand::withTrashed()->findOrFail($id);
        $deleted = $brandService->forceDeleteBrand($brand);

        if ($deleted) {
            return response()->json([
                'message' => 'Brand permanently deleted',
            ]);
        }

        return response()->json([
            'message' => 'Brand is not in trash',
        ], 400);
    }
}
