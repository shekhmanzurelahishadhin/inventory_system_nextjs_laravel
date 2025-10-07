<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Requests\softConfig\model\CreateModelRequest;
use App\Http\Resources\softConfig\model\ModelResource;
use App\Services\softConfig\ModelService;
use Illuminate\Http\Request;

class ProductModelController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:model.create|model.view|model.edit|model.delete')->only('index');
        $this->middleware('permission:model.create')->only('store');
        $this->middleware('permission:model.edit')->only('update');
        $this->middleware('permission:model.delete')->only('destroy');
    }

    public function index(Request $request, ModelService $modelService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search');

        $productModels = $modelService->getModels($filters, $perPage);

        if ($productModels instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            // Paginated response
            return response()->json([
                'data' => ModelResource::collection($productModels->items()),
                'total' => $productModels->total(),
                'current_page' => $productModels->currentPage(),
                'per_page' => $productModels->perPage(),
            ]);
        }

        // Collection response (no pagination)
        return response()->json([
            'data' => ModelResource::collection($productModels),
            'total' => $productModels->count(),
            'current_page' => 1,
            'per_page' => $productModels->count(),
        ]);
    }

    public function store(CreateModelRequest $request, ModelService $modelService)
    {
        $validatedData = $request->validated();

        $productModel = $modelService->createModel($validatedData);

        return response()->json([
            'message' => 'Model created successfully',
            'data' => new ModelResource($productModel),
        ]);
    }

}
