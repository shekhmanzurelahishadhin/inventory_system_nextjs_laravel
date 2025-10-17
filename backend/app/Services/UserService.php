<?php


namespace App\Services;


use App\Models\Role\UserHasRole;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\DB as FacadesDB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Hash as FacadesHash;

class UserService
{
    public function getUsers($filters = [], $perPage)
    {
        $query = User::query();

        // Restrict data if user is not superadmin and has a company_id
        if (Auth::check() && !Auth::user()->hasRole('Super Admin') && !empty(Auth::user()->company_id)) {
            $query->where('company_id', Auth::user()->company_id);
        }

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

        $query->with(['roles:id,name','company:id,name'])->orderBy('id','desc');

        // Return paginated if perPage is provided, else all
        return $perPage ? $query->paginate($perPage) : $query->get();
    }


    public function store(array $data)
    {
        DB::beginTransaction();

        try {
            $user = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'company_id'    => $data['company_id'],
                'password' => Hash::make($data['password']),
            ]);

            if (!empty($data['roles'])) {
                $user->syncRoles($data['roles']); // or roles()->sync()
            }

            DB::commit();

            return [
                'success' => true,
                'user'    => $user->load('roles'),
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Failed to create user',
                'error'   => $e->getMessage(), // optional for debugging
            ];
        }
    }

    public function update(User $user, array $data)
    {
        DB::beginTransaction();

        try {
            $user->name = $data['name'] ?? $user->name;
            $user->email = $data['email'] ?? $user->email;
            $user->company_id = $data['company_id'] ?? null;

            if (!empty($data['password'])) {
                $user->password = Hash::make($data['password']);
            }

            $user->save();


            if (!empty($data['roles'])) {
                $user->syncRoles($data['roles']);
            }

            DB::commit();

            return [
                'success' => true,
                'user' => $user->load('roles'),
            ];

        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Failed to update user',
                'error'   => $e->getMessage(),
            ];
        }
    }
    public function delete(User $user)
    {
        DB::beginTransaction();

        try {
            // Remove roles
            $user->syncRoles([]);

            // Remove direct permissions
            $user->syncPermissions([]);

            $user->delete();

            DB::commit();

            return [
                'success' => true,
            ];

        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage(),
            ];
        }
    }

}
