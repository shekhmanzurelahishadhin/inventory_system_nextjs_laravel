<?php

namespace App\Http\Resources\authorization;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermissionRecource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'module_name' => $this->module?->name ?? null,
            'menu_name' => $this->menu?->name ?? null,
            'sub_menu_name' => $this->subMenu?->name ?? null,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
