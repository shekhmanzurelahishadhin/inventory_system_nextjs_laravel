<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Requests\softConfig\unit\CreateUnitRequest;
use App\Http\Requests\softConfig\unit\UpdateUnitRequest;
use App\Http\Resources\softConfig\unit\UnitResource;
use App\Models\softConfig\Unit;
use App\Services\softConfig\UnitService;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:unit.create|unit.view|unit.edit|unit.delete')->only('index');
        $this->middleware('permission:unit.create')->only('store');
        $this->middleware('permission:unit.edit')->only('update');
        $this->middleware('permission:unit.delete')->only('destroy');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, UnitService $unitService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search','status','name','code','created_at','created_by');

        $units = $unitService->getUnits($filters, $perPage);

        if ($units instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            // Paginated response
            return response()->json([
                'data' => UnitResource::collection($units->items()),
                'total' => $units->total(),
                'current_page' => $units->currentPage(),
                'per_page' => $units->perPage(),
            ]);
        }

        // Collection response (no pagination)
        return response()->json([
            'data' => UnitResource::collection($units),
            'total' => $units->count(),
            'current_page' => 1,
            'per_page' => $units->count(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateUnitRequest $request, UnitService $unitService)
    {
        $validatedData = $request->validated();

        $unit = $unitService->createUnit($validatedData);

        return response()->json([
            'message' => 'Unit created successfully',
            'data' => new UnitResource($unit),
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
    public function update(UpdateUnitRequest $request, UnitService $unitService, Unit $unit)
    {

        $unit = $unitService->updateUnit($unit, $request->validated());

        return response()->json([
            'message' => 'Unit updated successfully',
            'data' => new UnitResource($unit),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // Soft delete (move to trash)
    public function trash(Unit $unit, UnitService $unitService)
    {
        $unitService->softDeleteUnit($unit);

        return response()->json([
            'message' => 'Unit moved to trash successfully',
        ]);
    }

    // Restore soft-deleted unit
    public function restore($id, UnitService $unitService)
    {
        $unit = Unit::withTrashed()->findOrFail($id);

        $unit = $unitService->restoreUnit($unit);

        return response()->json([
            'message' => 'Unit restored successfully',
            'data' => $unit,
        ]);
    }

    // Force delete permanently
    public function destroy($id, UnitService $unitService)
    {
        $unit = Unit::withTrashed()->findOrFail($id);
        $deleted = $unitService->forceDeleteUnit($unit);

        if ($deleted) {
            return response()->json([
                'message' => 'Unit permanently deleted',
            ]);
        }

        return response()->json([
            'message' => 'Unit is not in trash',
        ], 400);
    }
}
