<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\District;
use Illuminate\Database\Seeder;

class DistrictSeeder extends Seeder
{
    public function run(): void
    {
        $districts = [
            // Dhaka Division (13 districts)
            ['division' => 'dhaka', 'name' => 'ঢাকা', 'name_en' => 'dhaka', 'total_seats' => 20],
            ['division' => 'dhaka', 'name' => 'গাজীপুর', 'name_en' => 'gazipur', 'total_seats' => 5],
            ['division' => 'dhaka', 'name' => 'কিশোরগঞ্জ', 'name_en' => 'kishoreganj', 'total_seats' => 6],
            ['division' => 'dhaka', 'name' => 'মানিকগঞ্জ', 'name_en' => 'manikganj', 'total_seats' => 3],
            ['division' => 'dhaka', 'name' => 'মুন্সিগঞ্জ', 'name_en' => 'munshiganj', 'total_seats' => 3],
            ['division' => 'dhaka', 'name' => 'নারায়ণগঞ্জ', 'name_en' => 'narayanganj', 'total_seats' => 5],
            ['division' => 'dhaka', 'name' => 'নরসিংদী', 'name_en' => 'narsingdi', 'total_seats' => 5],
            ['division' => 'dhaka', 'name' => 'টাঙ্গাইল', 'name_en' => 'tangail', 'total_seats' => 8],
            ['division' => 'dhaka', 'name' => 'ফরিদপুর', 'name_en' => 'faridpur', 'total_seats' => 4],
            ['division' => 'dhaka', 'name' => 'গোপালগঞ্জ', 'name_en' => 'gopalganj', 'total_seats' => 3],
            ['division' => 'dhaka', 'name' => 'মাদারীপুর', 'name_en' => 'madaripur', 'total_seats' => 3],
            ['division' => 'dhaka', 'name' => 'রাজবাড়ী', 'name_en' => 'rajbari', 'total_seats' => 2],
            ['division' => 'dhaka', 'name' => 'শরীয়তপুর', 'name_en' => 'shariatpur', 'total_seats' => 3],
            
            // Chattogram Division (11 districts)
            ['division' => 'chattogram', 'name' => 'চট্টগ্রাম', 'name_en' => 'chattogram', 'total_seats' => 16],
            ['division' => 'chattogram', 'name' => 'কক্সবাজার', 'name_en' => 'coxsbazar', 'total_seats' => 4],
            ['division' => 'chattogram', 'name' => 'কুমিল্লা', 'name_en' => 'cumilla', 'total_seats' => 11],
            ['division' => 'chattogram', 'name' => 'ফেনী', 'name_en' => 'feni', 'total_seats' => 3],
            ['division' => 'chattogram', 'name' => 'ব্রাহ্মণবাড়িয়া', 'name_en' => 'brahmanbaria', 'total_seats' => 6],
            ['division' => 'chattogram', 'name' => 'রাঙ্গামাটি', 'name_en' => 'rangamati', 'total_seats' => 1],
            ['division' => 'chattogram', 'name' => 'বান্দরবান', 'name_en' => 'bandarban', 'total_seats' => 1],
            ['division' => 'chattogram', 'name' => 'খাগড়াছড়ি', 'name_en' => 'khagrachari', 'total_seats' => 1],
            ['division' => 'chattogram', 'name' => 'চাঁদপুর', 'name_en' => 'chandpur', 'total_seats' => 5],
            ['division' => 'chattogram', 'name' => 'লক্ষ্মীপুর', 'name_en' => 'lakshmipur', 'total_seats' => 4],
            ['division' => 'chattogram', 'name' => 'নোয়াখালী', 'name_en' => 'noakhali', 'total_seats' => 6],

            // Rajshahi Division (8 districts)
            ['division' => 'rajshahi', 'name' => 'রাজশাহী', 'name_en' => 'rajshahi', 'total_seats' => 6],
            ['division' => 'rajshahi', 'name' => 'বগুড়া', 'name_en' => 'bogura', 'total_seats' => 7],
            ['division' => 'rajshahi', 'name' => 'জয়পুরহাট', 'name_en' => 'joypurhat', 'total_seats' => 2],
            ['division' => 'rajshahi', 'name' => 'নওগাঁ', 'name_en' => 'naogaon', 'total_seats' => 6],
            ['division' => 'rajshahi', 'name' => 'নাটোর', 'name_en' => 'natore', 'total_seats' => 4],
            ['division' => 'rajshahi', 'name' => 'চাঁপাইনবাবগঞ্জ', 'name_en' => 'chapainawabganj', 'total_seats' => 3],
            ['division' => 'rajshahi', 'name' => 'পাবনা', 'name_en' => 'pabna', 'total_seats' => 5],
            ['division' => 'rajshahi', 'name' => 'সিরাজগঞ্জ', 'name_en' => 'sirajganj', 'total_seats' => 6],

            // Khulna Division (10 districts)
            ['division' => 'khulna', 'name' => 'খুলনা', 'name_en' => 'khulna', 'total_seats' => 5],
            ['division' => 'khulna', 'name' => 'বাগেরহাট', 'name_en' => 'bagerhat', 'total_seats' => 4],
            ['division' => 'khulna', 'name' => 'চুয়াডাঙ্গা', 'name_en' => 'chuadanga', 'total_seats' => 2],
            ['division' => 'khulna', 'name' => 'যশোর', 'name_en' => 'jessore', 'total_seats' => 6],
            ['division' => 'khulna', 'name' => 'ঝিনাইদহ', 'name_en' => 'jhenaidah', 'total_seats' => 4],
            ['division' => 'khulna', 'name' => 'কুষ্টিয়া', 'name_en' => 'kushtia', 'total_seats' => 4],
            ['division' => 'khulna', 'name' => 'মাগুরা', 'name_en' => 'magura', 'total_seats' => 2],
            ['division' => 'khulna', 'name' => 'মেহেরপুর', 'name_en' => 'meherpur', 'total_seats' => 1],
            ['division' => 'khulna', 'name' => 'নড়াইল', 'name_en' => 'narail', 'total_seats' => 2],
            ['division' => 'khulna', 'name' => 'সাতক্ষীরা', 'name_en' => 'satkhira', 'total_seats' => 3],

            // Barishal Division (6 districts)
            ['division' => 'barishal', 'name' => 'বরিশাল', 'name_en' => 'barishal', 'total_seats' => 6],
            ['division' => 'barishal', 'name' => 'বরগুনা', 'name_en' => 'barguna', 'total_seats' => 2],
            ['division' => 'barishal', 'name' => 'ভোলা', 'name_en' => 'bhola', 'total_seats' => 4],
            ['division' => 'barishal', 'name' => 'ঝালকাঠি', 'name_en' => 'jhalokathi', 'total_seats' => 2],
            ['division' => 'barishal', 'name' => 'পটুয়াখালী', 'name_en' => 'patuakhali', 'total_seats' => 4],
            ['division' => 'barishal', 'name' => 'পিরোজপুর', 'name_en' => 'pirojpur', 'total_seats' => 3],

            // Sylhet Division (4 districts)
            ['division' => 'sylhet', 'name' => 'সিলেট', 'name_en' => 'sylhet', 'total_seats' => 6],
            ['division' => 'sylhet', 'name' => 'হবিগঞ্জ', 'name_en' => 'habiganj', 'total_seats' => 5],
            ['division' => 'sylhet', 'name' => 'মৌলভীবাজার', 'name_en' => 'moulvibazar', 'total_seats' => 5],
            ['division' => 'sylhet', 'name' => 'সুনামগঞ্জ', 'name_en' => 'sunamganj', 'total_seats' => 5],

            // Rangpur Division (8 districts)
            ['division' => 'rangpur', 'name' => 'রংপুর', 'name_en' => 'rangpur', 'total_seats' => 6],
            ['division' => 'rangpur', 'name' => 'দিনাজপুর', 'name_en' => 'dinajpur', 'total_seats' => 7],
            ['division' => 'rangpur', 'name' => 'গাইবান্ধা', 'name_en' => 'gaibandha', 'total_seats' => 5],
            ['division' => 'rangpur', 'name' => 'কুড়িগ্রাম', 'name_en' => 'kurigram', 'total_seats' => 4],
            ['division' => 'rangpur', 'name' => 'লালমনিরহাট', 'name_en' => 'lalmonirhat', 'total_seats' => 3],
            ['division' => 'rangpur', 'name' => 'নীলফামারী', 'name_en' => 'nilphamari', 'total_seats' => 3],
            ['division' => 'rangpur', 'name' => 'পঞ্চগড়', 'name_en' => 'panchagarh', 'total_seats' => 1],
            ['division' => 'rangpur', 'name' => 'ঠাকুরগাঁও', 'name_en' => 'thakurgaon', 'total_seats' => 3],

            // Mymensingh Division (4 districts)
            ['division' => 'mymensingh', 'name' => 'ময়মনসিংহ', 'name_en' => 'mymensingh', 'total_seats' => 11],
            ['division' => 'mymensingh', 'name' => 'জামালপুর', 'name_en' => 'jamalpur', 'total_seats' => 5],
            ['division' => 'mymensingh', 'name' => 'নেত্রকোনা', 'name_en' => 'netrokona', 'total_seats' => 5],
            ['division' => 'mymensingh', 'name' => 'শেরপুর', 'name_en' => 'sherpur', 'total_seats' => 3],
        ];

        foreach ($districts as $district) {
            $division = Division::where('name_en', $district['division'])->first();
            
            if ($division) {
                District::create([
                    'division_id' => $division->id,
                    'name' => $district['name'],
                    'name_en' => $district['name_en'],
                    'total_seats' => $district['total_seats'],
                ]);
            }
        }
    }
}
