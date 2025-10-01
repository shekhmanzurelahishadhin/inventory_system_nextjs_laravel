<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use App\Http\Requests\softConfig\lookup\StoreLookupRequest;
use App\Http\Resources\softConfig\Lookup\LookupResource;
use App\Models\softConfig\Lookup;
use App\Services\softConfig\LookupService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LookupController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:lookup.create|lookup.view|lookup.edit|lookup.delete')->only('index');
        $this->middleware('permission:lookup.create')->only('store');
        $this->middleware('permission:lookup.edit')->only('update');
        $this->middleware('permission:lookup.delete')->only('destroy');
    }

    public function index(Request $request, LookupService $lookupService)
    {
        $perPage = $request->get('per_page'); // can be null
        $filters = $request->only('search');

        $lookups = $lookupService->getLookups($filters, $perPage);

        // Check if paginated
        if ($lookups instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            return response()->json([
                'data' => LookupResource::collection($lookups),
                'total' => $lookups->total(),
                'current_page' => $lookups->currentPage(),
                'per_page' => $lookups->perPage(),
            ]);
        }

        // Not paginated, return all
        return response()->json([
            'data' => LookupResource::collection($lookups),
            'total' => $lookups->count(),
            'current_page' => 1,
            'per_page' => $lookups->count(),
        ]);
    }
    public function store(StoreLookupRequest $request, LookupService $lookupService)
    {
        return $lookupService->store($request);
    }

    public function getLookupLists(){
        $types = Lookup::groupBy('type')->pluck('type')->map(fn($type) => [
            'value' => $type,
            'label' => $type,
        ]);

        return response()->json($types);
    }
}
