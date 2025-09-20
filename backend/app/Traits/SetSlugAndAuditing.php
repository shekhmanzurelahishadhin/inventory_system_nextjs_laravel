<?php

namespace App\Traits; // use plural 'Traits' is conventional

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

trait SetSlugAndAuditing
{
    public static function bootSetSlugAndAuditing()
    {
        // Run when creating a model
        static::creating(function ($model) {
            // Auto-generate slug if empty and model has a 'name' attribute
            if (empty($model->slug) && isset($model->name)) {
                $model->slug = Str::slug($model->name);
            }

            // Set created_by if column exists
            if (property_exists($model, 'created_by')) {
                $model->created_by = Auth::id();
            }
        });

        // Run when updating a model
        static::updating(function ($model) {
            if (property_exists($model, 'updated_by')) {
                $model->updated_by = Auth::id();
            }
        });

        // Run when soft deleting a model
        static::deleting(function ($model) {
            if (!$model->isForceDeleting() && property_exists($model, 'deleted_by')) {
                $model->deleted_by = Auth::id();
                $model->save();
            }
        });
    }
}
