<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\StudentApplication;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'phone',
        'role',
        'address',
        'password',
    ];
       public function examAttempts()
    {
        return $this->hasMany(ExamAttempt::class, 'student_id', 'id');
    }
 public function studentApplication()
{
    return $this->hasOne(StudentApplication::class);
}
public function evaluationsGiven()
{
    return $this->hasMany(StudentEvaluation::class, 'evaluated_by');
}
public function studentEvaluations()
{
    return $this->hasMany(StudentEvaluation::class, 'student_id');
}

public function courseRegistrations()
{
    return $this->hasManyThrough(
        CourseRegistration::class, 
        StudentApplication::class,  
        'user_id',                
        'student_application_id',  
        'id',                        
        'id'                        
    );
}


public function evaluationsReceived()
{
    return $this->hasMany(StudentEvaluation::class, 'student_id');
}

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


}
