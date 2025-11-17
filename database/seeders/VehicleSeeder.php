<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            ['name' => 'MC-01', 'type' => 'motorcycle'],
            ['name' => 'MC-02', 'type' => 'motorcycle'],
            ['name' => 'MC-SC-01', 'type' => 'motorcycle_sidecar'],
            ['name' => 'CAR-MATIC-01', 'type' => 'car_matic'],
            ['name' => 'CAR-MANUAL-01', 'type' => 'car_manual'],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::create($vehicle);
        }
    }
}
