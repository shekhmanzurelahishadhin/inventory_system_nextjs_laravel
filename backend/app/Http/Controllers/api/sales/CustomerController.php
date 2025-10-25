<?php

namespace App\Http\Controllers\api\sales;

use App\Http\Controllers\Controller;
use App\Http\Requests\sales\customer\CreateCustomerRequest;
use App\Http\Requests\sales\customer\UpdateCustomerRequest;
use App\Http\Resources\sales\CustomerResource;
use App\Models\sales\Customer;
use App\Services\sales\CustomerService;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:customer.create|customer.view|customer.edit|customer.delete')->only('index');
        $this->middleware('permission:customer.create')->only('store');
        $this->middleware('permission:customer.edit')->only('update');
        $this->middleware('permission:customer.delete')->only('destroy');
    }

    public function index(Request $request, CustomerService $customerService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search','status','name','code','company_name','address','opening_balance','opening_balance_type','phone','email','created_at','created_by');
        $companyId = $request->query('company_id');

        $customers = $customerService->getCustomers($filters, $perPage, $companyId);

        if ($customers instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            // Paginated response
            return response()->json([
                'data' => CustomerResource::collection($customers->items()),
                'total' => $customers->total(),
                'current_page' => $customers->currentPage(),
                'per_page' => $customers->perPage(),
            ]);
        }

        // Collection response (no pagination)
        return response()->json([
            'data' => CustomerResource::collection($customers),
            'total' => $customers->count(),
            'current_page' => 1,
            'per_page' => $customers->count(),
        ]);
    }

    public function store(CreateCustomerRequest $request, CustomerService $customerService)
    {
        $validatedData = $request->validated();

        $customer = $customerService->createCustomer($validatedData);

        return response()->json([
            'message' => 'Customer created successfully',
            'data' => new CustomerResource($customer),
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
    public function update(UpdateCustomerRequest $request, CustomerService $customerService, Customer $customer)
    {
        $customer  = $customerService->updateCustomer($customer , $request->validated());

        return response()->json([
            'message' => 'Customer updated successfully',
            'data' => new CustomerResource($customer),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // Soft delete (move to trash)
    public function trash(Customer $customer , CustomerService $customerService)
    {
        $customerService->softDeleteCustomer($customer);

        return response()->json([
            'message' => 'Customer moved to trash successfully',
        ]);
    }

    // Restore soft-deleted store
    public function restore($id, CustomerService $customerService)
    {
        $customer  = Customer::withTrashed()->findOrFail($id);

        $customer  = $customerService->restoreCustomer($customer);

        return response()->json([
            'message' => 'Customer restored successfully',
            'data' => $customer ,
        ]);
    }

    // Force delete permanently
    public function destroy($id, CustomerService $customerService)
    {
        $customer  = Customer::withTrashed()->findOrFail($id);
        $deleted = $customerService->forceDeleteCustomer($customer);

        if ($deleted) {
            return response()->json([
                'message' => 'Customer permanently deleted',
            ]);
        }

        return response()->json([
            'message' => 'Customer is not in trash',
        ], 400);
    }
}
