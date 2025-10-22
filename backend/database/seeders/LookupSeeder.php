<?php

namespace Database\Seeders;

use App\Models\softConfig\Lookup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class LookupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lookups = [
            // Status types with manual codes
            ['name' => 'Active',   'type' => 'active_status', 'code' => 1],
            ['name' => 'Inactive', 'type' => 'active_status', 'code' => 0],

            ['name' => 'Pending',  'type' => 'status', 'code' => 1],
            ['name' => 'Approved',  'type' => 'status', 'code' => 2],

            // Units with manual codes
            ['name' => 'Piece', 'type' => 'unit', 'code' => 1],
            ['name' => 'Kg',    'type' => 'unit', 'code' => 2],
            ['name' => 'Litre', 'type' => 'unit', 'code' => 3],

            ['name' => 'Debit',  'type' => 'transaction_type', 'code' => 1],
            ['name' => 'Credit', 'type' => 'transaction_type', 'code' => 2],
        ];

        foreach ($lookups as $lookup) {
            Lookup::updateOrInsert(
                [
                    'type' => $lookup['type'],
                    'code' => $lookup['code'], // unique condition
                ],
                [
                    'name'       => $lookup['name'],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]
            );
        }
    }
}
