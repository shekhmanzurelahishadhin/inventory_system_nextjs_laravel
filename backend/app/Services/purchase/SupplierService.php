<?php


namespace App\Services\purchase;


use App\Models\purchase\Supplier;
use Illuminate\Support\Facades\Auth;

class SupplierService
{
    public function getSuppliers(array $filters = [], $perPage = null, $companyId = null)
    {
        $query = Supplier::query()->select(
            'id',
            'name',
            'address',
            'company_id',
            'phone',
            'email',
            'status',
            'created_by',
            'created_at',
            'deleted_at'
        );
        // Restrict data if user is not superadmin and has a company_id
        if (Auth::check() && !Auth::user()->hasRole('Super Admin') && !empty(Auth::user()->company_id)) {
            $query->where('company_id', Auth::user()->company_id);
        }
        if ($companyId) {
            $query->where('company_id', $companyId);
        }
        // Handle status / trash logic
        if (($filters['status'] ?? '') === 'trash') {
            $query->onlyTrashed();
        } elseif (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', $filters['status']);
        } else {
            $query->withTrashed();
        }

        // Apply filters
        $query
            ->when($filters['name'] ?? null, fn($q, $name) => $q->where('name', 'like', "%{$name}%"))
            ->when($filters['address'] ?? null, fn($q, $address) => $q->where('address', 'like', "%{$address}%"))
            ->when($filters['email'] ?? null, fn($q, $email) => $q->where('email', 'like', "%{$email}%"))
            ->when($filters['phone'] ?? null, fn($q, $phone) => $q->where('phone', 'like', "%{$phone}%"))
            ->when($filters['created_by'] ?? null, fn($q, $createdBy) => $q->whereHas('createdBy', fn($sub) => $sub->where('name', 'like', "%{$createdBy}%")))
            ->when($filters['company_name'] ?? null, fn($q, $company) => $q->whereHas('company', fn($com) => $com->where('name', 'like', "%{$company}%")))
            ->when($filters['created_at'] ?? null, fn($q, $createdAt) => $q->whereDate('created_at', date('Y-m-d', strtotime($createdAt))))
            ->when($filters['search'] ?? null, fn($q, $term) => $q->where(function ($sub) use ($term) {
                $sub->where('name', 'like', "%{$term}%")
                    ->orWhere('phone', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%")
                    ->orWhere('address', 'like', "%{$term}%")
                    ->orWhereHas('company', fn($company) => $company->where('name', 'like', "%{$term}%")
                    )
                    ->orWhereHas('createdBy', fn($user) => $user->where('name', 'like', "%{$term}%")
                    );
            })
            );

        // Eager load common relations
        $query->with([
            'createdBy:id,name',
            'company:id,name'
        ])->orderByDesc('id');

        // Return results
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

}
