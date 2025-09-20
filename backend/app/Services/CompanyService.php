<?php


namespace App\Services;


use App\Models\softConfig\Company;

class CompanyService
{
    public function getCompanies($filters = [], $perPage)
    {
        $query = Company::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%");
        }

        return $query->orderBy('id','desc')->paginate($perPage);
    }
    public function createCompany(array $data)
    {
        return Company::create($data);
    }
}
