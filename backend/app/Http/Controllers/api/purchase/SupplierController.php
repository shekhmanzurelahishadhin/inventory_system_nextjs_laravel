<?php

namespace App\Http\Controllers\api\purchase;

use App\Http\Controllers\Controller;
use App\Http\Requests\purchase\supplier\CreateSupplierRequest;
use App\Http\Resources\purchase\SupplierResource;
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
        $filters = $request->only('search','status','name','code','company_name','address','prone','email','created_at','created_by');
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
}
