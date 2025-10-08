<?php

namespace App\Models\softConfig;

use App\Traits\SetSlugAndAuditing;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Store extends Model
{
    use HasFactory, SoftDeletes, SetSlugAndAuditing;

    protected $guarded = ['id'];
}
