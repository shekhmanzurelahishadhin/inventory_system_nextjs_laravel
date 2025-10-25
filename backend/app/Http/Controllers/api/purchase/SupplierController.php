<?php

namespace App\Http\Controllers\api\purchase;

use App\Http\Controllers\Controller;
use App\Http\Requests\purchase\supplier\CreateSupplierRequest;
use App\Http\Requests\purchase\supplier\UpdateSupplierRequest;
use App\Http\Resources\purchase\SupplierResource;
use App\Models\purchase\Supplier;
use App\Services\purchase\SupplierService;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:supplier.create|supplier.view|supplier.edit|supplier.delete')->only('index');
        $this->middleware('permission:supplier.create')->only('store');
        $this->middleware('permission:supplier.edit')->only('update');
        $this->middleware('permission:supplier.delete')->only('destroy');
    }

    public function index(Request $request, SupplierService $supplierService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search','status','name','code','company_name','address','opening_balance','opening_balance_type','phone','email','created_at','created_by');

        $companyId = $request->query('company_id');

        $suppliers = $supplierService->getSuppliers($filters, $perPage, $companyId);

        if ($suppliers instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            // Paginated response
            return response()->json([
                'data' => SupplierResource::collection($suppliers->items()),
                'total' => $suppliers->total(),
                'current_page' => $suppliers->currentPage(),
                'per_page' => $suppliers->perPage(),
            ]);
        }

        // Collection response (no pagination)
        return response()->json([
            'data' => SupplierResource::collection($suppliers),
            'total' => $suppliers->count(),
            'current_page' => 1,
            'per_page' => $suppliers->count(),
        ]);
    }

    public function store(CreateSupplierRequest $request, SupplierService $supplierService)
    {
        $validatedData = $request->validated();

        $supplier = $supplierService->createSupplier($validatedData);

        return response()->json([
            'message' => 'Supplier created successfully',
            'data' => new SupplierResource($supplier),
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
    public function update(UpdateSupplierRequest $request, SupplierService $supplierService, Supplier $supplier)
    {
        $supplier  = $supplierService->updateSupplier($supplier , $request->validated());

        return response()->json([
            'message' => 'Supplier updated successfully',
            'data' => new SupplierResource($supplier),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // Soft delete (move to trash)
    public function trash(Supplier $supplier , SupplierService $supplierService)
    {
        $supplierService->softDeleteSupplier($supplier);

        return response()->json([
            'message' => 'Supplier moved to trash successfully',
        ]);
    }

    // Restore soft-deleted store
    public function restore($id, SupplierService $supplierService)
    {
        $supplier  = Supplier::withTrashed()->findOrFail($id);

        $supplier  = $supplierService->restoreSupplier($supplier);

        return response()->json([
            'message' => 'Supplier restored successfully',
            'data' => $supplier ,
        ]);
    }

    // Force delete permanently
    public function destroy($id, SupplierService $supplierService)
    {
        $supplier  = Supplier::withTrashed()->findOrFail($id);
        $deleted = $supplierService->forceDeleteSupplier($supplier);

        if ($deleted) {
            return response()->json([
                'message' => 'Supplier permanently deleted',
            ]);
        }

        return response()->json([
            'message' => 'Supplier is not in trash',
        ], 400);
    }
}
