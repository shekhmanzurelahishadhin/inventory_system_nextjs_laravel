<?php


namespace App\Services;


use App\Models\User;

class UserService
{
    public function getUsers($filters = [], $perPage)
    {
        $query = User::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('roles', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return $query->with(['roles:id,name'])->orderBy('id','desc')->paginate($perPage);
    }

}
