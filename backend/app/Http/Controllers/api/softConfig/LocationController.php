<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Requests\softConfig\location\CreateLocationRequest;
use App\Http\Requests\softConfig\location\UpdateLocationRequest;
use App\Http\Resources\softConfig\location\LocationResource;
use App\Models\softConfig\Location;
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
        $filters = $request->only('search','status','name','company_name','store_name','code','description','created_at','created_by');
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

    /**
     * Location a newly created resource in storage.
     */
    public function store(CreateLocationRequest $request, LocationService $locationService)
    {
        $validatedData = $request->validated();

        $location  = $locationService->createLocation($validatedData);

        return response()->json([
            'message' => 'Location created successfully',
            'data' => new LocationResource($location),
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
    public function update(UpdateLocationRequest $request, LocationService $locationService, Location $location)
    {
        $location  = $locationService->updateLocation($location , $request->validated());

        return response()->json([
            'message' => 'Update updated successfully',
            'data' => new LocationResource($location),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // Soft delete (move to trash)
    public function trash(Location $location , LocationService $locationService)
    {
        $locationService->softDeleteLocation($location);

        return response()->json([
            'message' => 'Location moved to trash successfully',
        ]);
    }

    // Restore soft-deleted location
    public function restore($id, LocationService $locationService)
    {
        $location  = Location::withTrashed()->findOrFail($id);

        $location  = $locationService->restoreLocation($location);

        return response()->json([
            'message' => 'Location restored successfully',
            'data' => $location ,
        ]);
    }

    // Force delete permanently
    public function destroy($id, LocationService $locationService)
    {
        $location  = Location::withTrashed()->findOrFail($id);
        $deleted = $locationService->forceDeleteLocation($location);

        if ($deleted) {
            return response()->json([
                'message' => 'Location permanently deleted',
            ]);
        }

        return response()->json([
            'message' => 'Location is not in trash',
        ], 400);
    }
}
