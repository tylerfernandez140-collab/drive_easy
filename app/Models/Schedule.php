<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;
    
    
    protected $fillable = [
        'instructor_id',
        'course_registration_id',
        'date',
        'time',
        'location',
        'status',
        'description',
        'exam_status',
        'vehicle_id',
    ];

    /**
     * Relationships
     */

    // Belongs to a specific course registration
    public function courseRegistration()
    {
        return $this->belongsTo(CourseRegistration::class);
    }
    
   public function vehicle() { return $this->belongsTo(Vehicle::class); }
    // Belongs to a user who is an instructor
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }



public function students()
{
    return $this->hasManyThrough(
        User::class,
        CourseRegistration::class,
        'schedule_id',       
        'id',               
        'id',             
        'user_id'  
    );
}


}
