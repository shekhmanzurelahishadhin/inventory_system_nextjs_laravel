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

    public function update($request,$lookup)
    {
        try{
            $lookup = $lookup->update([
                'name' => $request->name,
                'status' => $request->status,
                'updated_at' => Carbon::now()
            ]);
            return [
                'success' => true,
                'message' => 'Lookup Updated Successfully.',
                'data' => $lookup,
            ];
        }
        catch (\Exception $e){
            return [
                'success' => false,
                'message' => 'Lookup not Updated.',
                'error' => $e->getMessage(),
            ];
        }
    }

    public function softDeleteLookup(Lookup $lookup)
    {
        $lookup->delete();
    }

    public function restoreLookup(Lookup $lookup)
    {
        if ($lookup->trashed()) {
            $lookup->restore();
        }
        return $lookup;
    }

    public function forceDeleteLookup(Lookup $lookup)
    {
        if ($lookup->trashed()) {
            // delete logo from storage

            $lookup->forceDelete();
            return true;
        }
        return false;
    }
    public function getLookupListByType($type,$code)
    {

        $values = Lookup::where('type',$type)->where('status',1)->get();

        $status = $code?"":"<option value=''>Select One</option>";
        foreach ($values as $value){
            $selected = $value->code == $code ? 'selected' : '';
            $status .= "<option value='{$value->code}' $selected>{$value->name}</option>";
        }
        return $status;

    }

    public function getLookupNameByCode($type,$code)
    {

        $value = Lookup::where('type',$type)->where('code',$code)->first();
        if ($value){
            return $value->name;
        }
        else{
            return 'Not Defined';
        }
    }
}
