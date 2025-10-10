<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Resources\softConfig\location\LocationResource;
use App\Services\softConfig\LocationService;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:location.create|location.view|location.edit|location.delete')->only('index');
        $this->middleware('permission:location.create')->only('location');
        $this->middleware('permission:location.edit')->only('update');
        $this->middleware('permission:location.delete')->only('destroy');
    }
    public function index(Request $request, LocationService $locationService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search','status');
        $companyId = $request->query('company_id');
        $storeId = $request->query('store_id');

        $locations = $locationService->getLocations($filters, $perPage, $companyId, $storeId);

        if ($locations instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            // Paginated response
            return response()->json([
                'data' => LocationResource::collection($locations->items()),
                'total' => $locations->total(),
                'current_page' => $locations->currentPage(),
                'per_page' => $locations->perPage(),
            ]);
        }

        // Collection response (no pagination)
        return response()->json([
            'data' => LocationResource::collection($locations),
            'total' => $locations->count(),
            'current_page' => 1,
            'per_page' => $locations->count(),
        ]);
    }
}
