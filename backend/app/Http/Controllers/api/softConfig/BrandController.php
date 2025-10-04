<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Resources\softConfig\brand\BrandResource;
use App\Services\softConfig\BrandService;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index(Request $request, BrandService $brandService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search');

        $brands = $brandService->getCategories($filters, $perPage);

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
}
