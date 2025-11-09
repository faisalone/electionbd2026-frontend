<?php

namespace Database\Seeders;

use App\Models\Division;
use Illuminate\Database\Seeder;

class DivisionSeeder extends Seeder
{
    public function run(): void
    {
        $divisions = [
            ['name' => 'ঢাকা', 'name_en' => 'dhaka', 'total_seats' => 47],
            ['name' => 'চট্টগ্রাম', 'name_en' => 'chattogram', 'total_seats' => 45],
            ['name' => 'রাজশাহী', 'name_en' => 'rajshahi', 'total_seats' => 33],
            ['name' => 'খুলনা', 'name_en' => 'khulna', 'total_seats' => 29],
            ['name' => 'বরিশাল', 'name_en' => 'barishal', 'total_seats' => 20],
            ['name' => 'সিলেট', 'name_en' => 'sylhet', 'total_seats' => 19],
            ['name' => 'রংপুর', 'name_en' => 'rangpur', 'total_seats' => 30],
            ['name' => 'ময়মনসিংহ', 'name_en' => 'mymensingh', 'total_seats' => 21],
        ];

        foreach ($divisions as $division) {
            Division::create($division);
        }
    }
}
