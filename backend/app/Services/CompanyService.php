<?php


namespace App\Services;


use App\Models\softConfig\Company;

class CompanyService
{
    public function getCompanies($filters = [], $perPage)
    {
        $query = Company::withTrashed();;

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%");
        }

        $query->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }
    public function createCompany(array $data)
    {
        if (empty($data['code'])) {
            $data['code'] = generateCode('CMP', 'companies', 'code');
        }
        return Company::create($data);
    }

    public function updateCompany(Company $company, array $data)
    {
        return $company->update($data);
    }


    public function softDeleteCompany(Company $company)
    {
        $company->delete();
    }

    public function restoreCompany(Company $company)
    {
        if ($company->trashed()) {
            $company->restore();
        }
        return $company;
    }

    public function forceDeleteCompany(Company $company)
    {
        if ($company->trashed()) {
            $company->forceDelete();
            return true;
        }
        return false;
    }
}
