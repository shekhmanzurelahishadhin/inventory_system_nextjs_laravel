<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Requests\softConfig\company\CreateCompanyRequest;
use App\Http\Resources\softConfig\company\CompanyResource;
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

        return response()->json([
            'data' => CompanyResource::collection($companies),
            'total' => $companies->total(),
            'current_page' => $companies->currentPage(),
            'per_page' => $companies->perPage(),
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
