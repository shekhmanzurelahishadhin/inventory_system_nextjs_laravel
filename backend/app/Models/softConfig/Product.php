<?php

namespace App\Models\softConfig;

use App\Models\User;
use App\Traits\SetSlugAndAuditing;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes, SetSlugAndAuditing;

    protected $guarded = ['id'];

    public function brand(){
        return $this->hasOne(Brand::class,'id', 'brand_id');
    }
    public function unit(){
        return $this->hasOne(Unit::class,'id', 'unit_id');
    }
    public function productModel(){
        return $this->hasOne(ProductModel::class,'id', 'model_id');
    }
    public function category(){
        return $this->hasOne(Category::class,'id', 'category_id');
    }
    public function subCategory(){
        return $this->hasOne(SubCategory::class,'id', 'sub_category_id');
    }
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
