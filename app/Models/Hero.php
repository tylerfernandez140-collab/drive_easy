<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    protected $fillable = [
        'icon_path',
        'tagline',
        'heading',
        'highlight',
        'description',
        'feature_one_title',
        'feature_one_description',
        'feature_two_title',
        'feature_two_description',
        'feature_three_title',
        'feature_three_description',
    ];
}
