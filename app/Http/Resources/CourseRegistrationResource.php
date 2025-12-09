<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseRegistrationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         return [
            'id' => $this->id,
            'student_application_id' => $this->student_application_id,
            'course_type' => $this->course_type,
            'course_status' => $this->course_status,
            'user' => [
                'id' => $this->studentApplication->user->id,
                'first_name' => $this->studentApplication->user->first_name,
                'last_name' => $this->studentApplication->user->last_name,
            ],
        ];
    }
}
