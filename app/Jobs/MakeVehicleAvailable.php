<?php

namespace App\Jobs;

use App\Models\Vehicle;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class MakeVehicleAvailable implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $vehicleId;

    public function __construct(int $vehicleId)
    {
        $this->vehicleId = $vehicleId;
    }

    public function handle(): void
    {
        $vehicle = Vehicle::find($this->vehicleId);

        if (! $vehicle) {
            return;
        }

        // optional: only free it if the until time has passed
        if ($vehicle->unavailable_until && now()->lessThan($vehicle->unavailable_until)) {
            // still not time, just exit
            return;
        }

        $vehicle->update([
            'status' => 'available',
            'unavailable_until' => null,
        ]);
    }
}
