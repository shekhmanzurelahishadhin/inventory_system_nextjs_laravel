<?php


namespace App\Services\purchase;


use App\Models\purchase\Supplier;
use App\Models\purchase\SupplierLedger;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SupplierService
{
    public function getSuppliers(array $filters = [], $perPage = null, $companyId = null)
    {
        $query = Supplier::query()->select(
            'id',
            'name',
            'code',
            'address',
            'company_id',
            'opening_balance',
            'opening_balance_type',
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
            ->when($filters['code'] ?? null, fn($q, $code) => $q->where('code', 'like', "%{$code}%"))
            ->when($filters['address'] ?? null, fn($q, $address) => $q->where('address', 'like', "%{$address}%"))
            ->when($filters['email'] ?? null, fn($q, $email) => $q->where('email', 'like', "%{$email}%"))
            ->when($filters['phone'] ?? null, fn($q, $phone) => $q->where('phone', 'like', "%{$phone}%"))
            ->when($filters['opening_balance'] ?? null, fn($q, $opening_balance) => $q->where('opening_balance', 'like', "%{$opening_balance}%"))
            ->when($filters['opening_balance_type'] ?? null, fn($q, $opening_balance_type) => $q->where('opening_balance_type',  $opening_balance_type))
            ->when($filters['created_by'] ?? null, fn($q, $createdBy) => $q->whereHas('createdBy', fn($sub) => $sub->where('name', 'like', "%{$createdBy}%")))
            ->when($filters['company_name'] ?? null, fn($q, $company) => $q->whereHas('company', fn($com) => $com->where('name', 'like', "%{$company}%")))
            ->when($filters['created_at'] ?? null, fn($q, $createdAt) => $q->whereDate('created_at', date('Y-m-d', strtotime($createdAt))))
            ->when($filters['search'] ?? null, fn($q, $term) => $q->where(function ($sub) use ($term) {
                $sub->where('name', 'like', "%{$term}%")
                    ->orWhere('code', 'like', "%{$term}%")
                    ->orWhere('phone', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%")
                    ->orWhere('address', 'like', "%{$term}%")
                    ->orWhere('opening_balance', 'like', "%{$term}%")
                    ->orWhereHas('company', fn($company) => $company->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('balanceType', fn($type) => $type->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('createdBy', fn($user) => $user->where('name', 'like', "%{$term}%"));
            })
            );

        // Eager load common relations
        $query->with([
            'createdBy:id,name',
            'balanceType:code,name',
            'company:id,name'
        ])->orderByDesc('id');

        // Return results
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function createSupplier(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Generate unique supplier code
            $data['code'] = generateCode('SUP', 'suppliers', 'code');

            // Create supplier
            $supplier = Supplier::create($data);

            // If opening balance exists, insert into supplier_ledger
            if (!empty($supplier->opening_balance) && $supplier->opening_balance > 0) {
                SupplierLedger::create([
                    'supplier_id'   => $supplier->id,
                    'company_id'    => $supplier->company_id,
                    'date'          => now(),
                    'reference'     => 'Opening Balance',
                    'description'   => 'Opening balance entry for supplier',
                    'debit'         => $supplier->opening_balance_type === '1' ? $supplier->opening_balance : 0,
                    'credit'        => $supplier->opening_balance_type === '2' ? $supplier->opening_balance : 0,
                    'balance'       => $supplier->opening_balance,
                    'balance_type'  => $supplier->opening_balance_type,
                    'created_by'    => Auth::id(),
                ]);
            }

            return $supplier;
        });
    }


    public function updateSupplier(Supplier $supplier, array $data)
    {
        return DB::transaction(function () use ($supplier, $data) {

            // Update supplier basic info
            $supplier->update($data);

            // Check if supplier has opening balance
            $hasOpeningBalance = !empty($data['opening_balance']) && $data['opening_balance'] > 0;

            // Try to find existing opening balance ledger entry
            $existingLedger = SupplierLedger::where('supplier_id', $supplier->id)
                ->where('reference', 'Opening Balance')
                ->first();

            if ($hasOpeningBalance) {
                if ($existingLedger) {
                    // Update existing opening balance ledger
                    $existingLedger->update([
                        'date'          => now(),
                        'company_id'    => $supplier->company_id,
                        'description'   => 'Updated opening balance entry for supplier',
                        'debit'         => $data['opening_balance_type'] == 1 ? $data['opening_balance'] : 0,
                        'credit'        => $data['opening_balance_type'] == 2 ? $data['opening_balance'] : 0,
                        'balance'       => $data['opening_balance'],
                        'balance_type'  => $data['opening_balance_type'],
                        'updated_by'    => Auth::id(),
                    ]);
                } else {
                    // Create new opening balance ledger
                    SupplierLedger::create([
                        'supplier_id'   => $supplier->id,
                        'company_id'    => $supplier->company_id,
                        'date'          => now(),
                        'reference'     => 'Opening Balance',
                        'description'   => 'Opening balance entry for supplier',
                        'debit'         => $data['opening_balance_type'] == 1 ? $data['opening_balance'] : 0,
                        'credit'        => $data['opening_balance_type'] == 2 ? $data['opening_balance'] : 0,
                        'balance'       => $data['opening_balance'],
                        'balance_type'  => $data['opening_balance_type'],
                        'created_by'    => Auth::id(),
                    ]);
                }
            } else {
                // If opening balance is removed, delete existing ledger entry
                if ($existingLedger) {
                    $existingLedger->delete();
                }
            }

            return $supplier->fresh(); // return the updated supplier with relations if needed
        });
    }



    public function softDeleteSupplier(Supplier $supplier)
    {
        $supplier->delete();
    }

    public function restoreSupplier(Supplier $supplier)
    {
        if ($supplier->trashed()) {
            $supplier->restore();
        }
        return $supplier;
    }

    public function forceDeleteSupplier(Supplier $supplier)
    {
        if ($supplier->trashed()) {
            $supplier->forceDelete();
            return true;
        }
        return false;
    }

}
