<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSections extends Model
{
    protected $fillable = [
        'key', 'title', 'is_active', 'sort_order',
    ];
}
