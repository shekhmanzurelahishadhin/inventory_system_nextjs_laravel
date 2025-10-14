<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Requests\softConfig\company\CreateCompanyRequest;
use App\Http\Requests\softConfig\company\UpdateCompanyRequest;
use App\Http\Resources\softConfig\company\CompanyResource;
use App\Models\softConfig\Company;
use App\Services\softConfig\CompanyService;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:company.create|company.view|company.edit|company.delete')->only('index');
        $this->middleware('permission:company.create')->only('store');
        $this->middleware('permission:company.edit')->only('update');
        $this->middleware('permission:company.delete')->only('destroy');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, CompanyService $companyService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search','status','name','email','code','address','created_at','created_by');

        $companies = $companyService->getCompanies($filters, $perPage);

        if ($companies instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            // Paginated response
            return response()->json([
                'data' => CompanyResource::collection($companies->items()),
                'total' => $companies->total(),
                'current_page' => $companies->currentPage(),
                'per_page' => $companies->perPage(),
            ]);
        }

        // Collection response (no pagination)
        return response()->json([
            'data' => CompanyResource::collection($companies),
            'total' => $companies->count(),
            'current_page' => 1,
            'per_page' => $companies->count(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateCompanyRequest $request, CompanyService $companyService)
    {
        $validatedData = $request->validated();

        $company = $companyService->createCompany($validatedData);

        return response()->json([
            'message' => 'Company created successfully',
            'data' => new CompanyResource($company),
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
    public function update(UpdateCompanyRequest $request, CompanyService $companyService, Company $company)
    {

        $company = $companyService->updateCompany($company, $request->validated());

        return response()->json([
            'message' => 'Company updated successfully',
            'data' => new CompanyResource($company),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // Soft delete (move to trash)
    public function trash(Company $company, CompanyService $companyService)
    {
        $companyService->softDeleteCompany($company);

        return response()->json([
            'message' => 'Company moved to trash successfully',
        ]);
    }

    // Restore soft-deleted company
    public function restore($id, CompanyService $companyService)
    {
        $company = Company::withTrashed()->findOrFail($id);

        $company = $companyService->restoreCompany($company);

        return response()->json([
            'message' => 'Company restored successfully',
            'data' => $company,
        ]);
    }

    // Force delete permanently
    public function destroy($id, CompanyService $companyService)
    {
        $company = Company::withTrashed()->findOrFail($id);
        $deleted = $companyService->forceDeleteCompany($company);

        if ($deleted) {
            return response()->json([
                'message' => 'Company permanently deleted',
            ]);
        }

        return response()->json([
            'message' => 'Company is not in trash',
        ], 400);
    }
}
