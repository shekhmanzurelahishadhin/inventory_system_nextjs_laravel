<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Requests\softConfig\store\CreateStoreRequest;
use App\Http\Requests\softConfig\store\UpdateStoreRequest;
use App\Http\Resources\softConfig\store\StoreResource;
use App\Models\softConfig\Store;
use App\Services\softConfig\StoreService;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:store.create|store.view|store.edit|store.delete')->only('index');
        $this->middleware('permission:store.create')->only('store');
        $this->middleware('permission:store.edit')->only('update');
        $this->middleware('permission:store.delete')->only('destroy');
    }
    public function index(Request $request, StoreService $storeService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search','status','name','company_name','code','address','created_at','created_by');
        $companyId = $request->query('company_id');

        $stores = $storeService->getStores($filters, $perPage, $companyId);

        if ($stores instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            // Paginated response
            return response()->json([
                'data' => StoreResource::collection($stores->items()),
                'total' => $stores->total(),
                'current_page' => $stores->currentPage(),
                'per_page' => $stores->perPage(),
            ]);
        }

        // Collection response (no pagination)
        return response()->json([
            'data' => StoreResource::collection($stores),
            'total' => $stores->count(),
            'current_page' => 1,
            'per_page' => $stores->count(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateStoreRequest $request, StoreService $storeService)
    {
        $validatedData = $request->validated();

        $store  = $storeService->createStore($validatedData);

        return response()->json([
            'message' => 'Store created successfully',
            'data' => new StoreResource($store),
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
    public function update(UpdateStoreRequest $request, StoreService $storeService, Store $store)
    {
        $store  = $storeService->updateStore($store , $request->validated());

        return response()->json([
            'message' => 'Store updated successfully',
            'data' => new StoreResource($store),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // Soft delete (move to trash)
    public function trash(Store $store , StoreService $storeService)
    {
        $storeService->softDeleteStore($store);

        return response()->json([
            'message' => 'Store moved to trash successfully',
        ]);
    }

    // Restore soft-deleted store
    public function restore($id, StoreService $storeService)
    {
        $store  = Store::withTrashed()->findOrFail($id);

        $store  = $storeService->restoreStore($store);

        return response()->json([
            'message' => 'Store restored successfully',
            'data' => $store ,
        ]);
    }

    // Force delete permanently
    public function destroy($id, StoreService $storeService)
    {
        $store  = Store::withTrashed()->findOrFail($id);
        $deleted = $storeService->forceDeleteStore($store);

        if ($deleted) {
            return response()->json([
                'message' => 'Store permanently deleted',
            ]);
        }

        return response()->json([
            'message' => 'Store is not in trash',
        ], 400);
    }
}
