<?php


namespace App\Services;


use App\Models\softConfig\Company;
use App\Traits\FileUploader;

class CompanyService
{
    use FileUploader;

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
        // handle logo upload if present
        if (isset($data['logo']) && $data['logo'] instanceof \Illuminate\Http\UploadedFile) {
            $data['logo'] = $this->fileUpload($data['logo'], 'companyLogos');
        }

        return Company::create($data);
    }

    public function updateCompany(Company $company, array $data)
    {
        // handle logo replacement
        if (isset($data['logo']) && $data['logo'] instanceof \Illuminate\Http\UploadedFile) {
            $data['logo'] = $this->fileUpload($data['logo'], 'logos', $company->logo_path);
            unset($data['logo']);
        }

        $company->update($data); // updates the model
        return $company;         // return the model itself
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
            // delete logo from storage
            $this->unlink($company->logo);

            $company->forceDelete();
            return true;
        }
        return false;
    }
}
