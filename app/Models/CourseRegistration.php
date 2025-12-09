<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourseRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_application_id',
        'course_type',
        'course_status',
        'admin_remarks',
        'certificate_issued_at',
    ];

    public function studentApplication()
    {
        return $this->belongsTo(StudentApplication::class);
    }

    public function isCompleted(): bool
    {
        return $this->course_status === 'completed';
    }

    public function isApproved(): bool
    {
        return $this->registration_status === 'approved';
    }
     public function evaluations()
{
    return $this->hasMany(StudentEvaluation::class, 'course_registration_id');
}
// in App\Models\CourseRegistration.php

public function schedules()
{
    return $this->hasMany(Schedule::class, 'course_registration_id');
}

    
}
