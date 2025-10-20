<?php

namespace App\Models\purchase;

use App\Models\softConfig\Company;
use App\Models\User;
use App\Traits\SetSlugAndAuditing;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory, SoftDeletes, SetSlugAndAuditing;

    protected $guarded = ['id'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
