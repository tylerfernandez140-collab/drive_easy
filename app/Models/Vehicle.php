<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'plate_number',
        'status',          // available | unavailable | maintenance | ...
        'active',
        'unavailable_until',
    ];

    protected $casts = [
        'unavailable_until' => 'datetime',
    ];

    // Relationships
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    // Accessor for readable label
    public function getLabelAttribute()
    {
        return "{$this->name} (" . ucfirst(str_replace('_', ' ', $this->type)) . ")";
    }

    // Scope for only active vehicles
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    // Scope for available (basic)
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    /**
     * Scope: actually available right now
     * - status must be 'available'
     * - AND unavailable_until is null OR already passed
     */
    public function scopeActuallyAvailable($query)
    {
        return $query
            ->where('status', 'available')
            ->where(function ($q) {
                $q->whereNull('unavailable_until')
                  ->orWhere('unavailable_until', '<=', now());
            });
    }

    /**
     * Helper to check in blade/controller:
     */
    public function isAvailableNow(): bool
    {
        if ($this->status !== 'available') {
            return false;
        }

        if ($this->unavailable_until instanceof Carbon) {
            return $this->unavailable_until->isPast();
        }

        return true;
    }
}
