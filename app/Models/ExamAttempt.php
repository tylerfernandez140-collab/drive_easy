<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'score',
        'status',
        'attempt_number',
        'total_score',
        'percentage',
    ];

    /**
     * Relationships
     */

    // An attempt belongs to a student (User)
    // public function examAttempts()
    // {
    //     return $this->hasMany(ExamAttempt::class, 'student_id', 'id');
    // }
     public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function evaluation()
{
    return $this->hasOne(StudentEvaluation::class, 'student_id', 'student_id');
}
}
