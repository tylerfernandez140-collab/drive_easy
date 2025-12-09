<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentEvaluation extends Model
{
    use HasFactory;

    protected $table = 'students_evaluations';

  protected $fillable = [
    'student_id',
    'course_type',
    'course_registration_id',
    'scores',
    'total_score',
    'remark',
    'instructor_notes',
    'evaluated_by',
];


    protected $casts = [
        'scores' => 'array',
    ];

    /**
     * The student being evaluated (User with role: student)
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
public function schedule()
{
    return $this->belongsTo(Schedule::class);
}
public function courseRegistration()
    {
        return $this->belongsTo(CourseRegistration::class);
    }

    /**
     * The instructor who created the evaluation (User with role: instructor)
     */
    public function evaluatedBy()
    {
        return $this->belongsTo(User::class, 'evaluated_by');
    }

    /**
     * The instructor who evaluated the student (User with role: instructor)
     */
    
  public function hasPassed()
{
    return $this->remark === 'Passed'; 
}

public function certificateUrl()
{
    return route('certificate.download', ['id' => $this->id]);
}
public function examAttempts()
{
    return $this->hasMany(ExamAttempt::class, 'student_id', 'student_id');
}

    /**
     * Get the student application associated with the evaluation via course registration
     */
    public function studentApplication()
    {
        return $this->hasOneThrough(
            StudentApplication::class,
            CourseRegistration::class,
            'id', // Foreign key on CourseRegistration table
            'id', // Foreign key on StudentApplication table
            'course_registration_id', // Local key on StudentEvaluation table
            'student_application_id' // Foreign key on CourseRegistration table
        );
    }
}
