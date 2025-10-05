<?php

namespace App\Http\Controllers\api\softConfig;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductModelController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:model.create|model.view|model.edit|model.delete')->only('index');
        $this->middleware('permission:model.create')->only('store');
        $this->middleware('permission:model.edit')->only('update');
        $this->middleware('permission:model.delete')->only('destroy');
    }
}
