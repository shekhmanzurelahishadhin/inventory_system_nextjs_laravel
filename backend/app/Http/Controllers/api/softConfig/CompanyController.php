<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Requests\softConfig\company\CreateCompanyRequest;
use App\Http\Requests\softConfig\company\UpdateCompanyRequest;
use App\Http\Resources\softConfig\company\CompanyResource;
use App\Models\softConfig\Company;
use App\Services\CompanyService;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, CompanyService $companyService)
    {
        $perPage = $request->get('per_page');
        $filters = $request->only('search');

        $companies = $companyService->getCompanies($filters, $perPage);

        if ($companies instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            // Paginated response
            return response()->json([
                'data' => $companies->items(),
                'total' => $companies->total(),
                'current_page' => $companies->currentPage(),
                'per_page' => $companies->perPage(),
            ]);
        }

        // Collection response (no pagination)
        return response()->json([
            'data' => $companies,
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
        $company = $companyService->createCompany($request->validated());

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
    public function restore(Company $company, CompanyService $companyService)
    {
        $company = $companyService->restoreCompany($company);

        return response()->json([
            'message' => 'Company restored successfully',
            'data' => $company,
        ]);
    }

    // Force delete permanently
    public function destroy(Company $company, CompanyService $companyService)
    {
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
