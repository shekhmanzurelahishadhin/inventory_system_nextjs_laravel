<?php


namespace App\Services\softConfig;


use App\Models\softConfig\Lookup;
use Carbon\Carbon;

class LookupService
{
    public function getLookups($filters = [], $perPage)
    {
        $query = Lookup::withTrashed();;

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%");
        }

        $query->orderBy('id','desc');
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function store($request)
    {
        try {
            if ($request->is_new == 1) {

                if (Lookup::where('type', trim(str_replace(" ", "_", $request->type_write)))->exists()) {
                    return [
                        'success' => false,
                        'message' => 'Lookup Type Already Exist.',
                        'errors' => ['Lookup Type Already Exist.'],
                    ];
                } else {
                    $lookup = Lookup::insert([
                        'name' => trim($request->name),
                        'type' => trim(str_replace(" ", "_", $request->type_write)),
                        'code' => 1,
                        'created_at' => Carbon::now()
                    ]);
                    return [
                        'success' => true,
                        'message' => 'Lookup saved Successfully.',
                        'data' => $lookup,
                    ];
                }
            }
            else {

                $lookup = Lookup::insert([
                    'name' => trim($request->name),
                    'type' => $request->type_select,
                    'code' => Lookup::where('type', $request->type_select)->max('code') + 1,
                    'created_at' => Carbon::now()
                ]);
                return [
                    'success' => true,
                    'message' => 'Lookup saved Successfully.',
                    'data' => $lookup,
                ];
            }
        }
        catch (\Exception $e){
            return [
                'success' => false,
                'message' => 'Lookup not Updated.',
                'error' => $e->getMessage(),
            ];
        }

    }
}
