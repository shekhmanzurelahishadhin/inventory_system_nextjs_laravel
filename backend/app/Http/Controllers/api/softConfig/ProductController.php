<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Requests\softConfig\product\CreateProductRequest;
use App\Http\Requests\softConfig\product\UpdateProductRequest;
use App\Http\Resources\softConfig\product\ProductResource;
use App\Models\softconfig\Product;
use App\Services\softConfig\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:product.create|product.view|product.edit|product.delete')->only('index');
        $this->middleware('permission:product.create')->only('store');
        $this->middleware('permission:product.edit')->only('update');
        $this->middleware('permission:product.delete')->only('destroy');
    }

    public function index(Request $request, ProductService $productService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search','status','name','code','category_name','sub_category_name','brand_name','model_name','unit_name','selling_price','purchase_price','reorder_level','created_at','created_by');
        $categoryId = $request->query('category_id');
        $subCategoryId = $request->query('sub_category_id');
        $brandId = $request->query('brand_id');
        $modelId = $request->query('model_id');
        $products = $productService->getProducts($filters, $perPage, $categoryId, $subCategoryId, $brandId, $modelId);

        if ($products instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            // Paginated response
            return response()->json([
                'data' => ProductResource::collection($products->items()),
                'total' => $products->total(),
                'current_page' => $products->currentPage(),
                'per_page' => $products->perPage(),
            ]);
        }

        // Collection response (no pagination)
        return response()->json([
            'data' => ProductResource::collection($products),
            'total' => $products->count(),
            'current_page' => 1,
            'per_page' => $products->count(),
        ]);
    }

    public function store(CreateProductRequest $request, ProductService $productService)
    {
        $validatedData = $request->validated();

        $product = $productService->createProduct($validatedData);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => new ProductResource($product),
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
    public function update(UpdateProductRequest $request, ProductService $productService, Product $product)
    {

        $product = $productService->updateProduct($product, $request->validated());

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => new ProductResource($product),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // Soft delete (move to trash)
    public function trash(Product $product, ProductService $productService)
    {
        $productService->softDeleteProduct($product);

        return response()->json([
            'message' => 'Product moved to trash successfully',
        ]);
    }

    // Restore soft-deleted brand
    public function restore($id, ProductService $productService)
    {
        $product = Product::withTrashed()->findOrFail($id);

        $product = $productService->restoreProduct($product);

        return response()->json([
            'message' => 'Product restored successfully',
            'data' => $product,
        ]);
    }

    // Force delete permanently
    public function destroy($id, ProductService $productService)
    {
        $product = Product::withTrashed()->findOrFail($id);
        $deleted = $productService->forceDeleteProduct($product);

        if ($deleted) {
            return response()->json([
                'message' => 'Product permanently deleted',
            ]);
        }

        return response()->json([
            'message' => 'Product is not in trash',
        ], 400);
    }
}
