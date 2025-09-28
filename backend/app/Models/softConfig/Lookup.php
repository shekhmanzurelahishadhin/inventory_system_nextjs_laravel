<?php

namespace App\Models\softConfig;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lookup extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'name',
        'type',
        'code',
        'status'
    ];
}
