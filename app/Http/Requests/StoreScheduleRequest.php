<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\CourseRegistration;

class StoreScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // base rules (for BOTH theoretical and practical)
        return [
            'instructor_id' => ['required', 'exists:users,id'],
            'course_registration_id' => ['required', 'exists:course_registrations,id'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'location' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            // these two will be validated conditionally in withValidator()
            'time' => ['nullable', Rule::in(['08:00', '10:00', '13:00', '15:00'])],
            'vehicle_id' => ['nullable', 'exists:vehicles,id'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($v) {
            $regId = $this->input('course_registration_id');

            if (! $regId) {
                return;
            }

            $reg = CourseRegistration::find($regId);
            if (! $reg) {
                return;
            }

            $courseType = strtolower($reg->course_type ?? '');

            $isTheoretical =
                str_contains($courseType, 'theoretical') ||
                str_contains($courseType, 'theory') ||
                $courseType === 'th';

            // ✅ PRACTICAL: must have time + vehicle
            if (! $isTheoretical) {
                if (! $this->input('time')) {
                    $v->errors()->add('time', 'Time is required for practical training.');
                }

                if (! $this->input('vehicle_id')) {
                    $v->errors()->add('vehicle_id', 'Vehicle is required for practical training.');
                }
            }

            // ✅ THEORETICAL: must NOT force time/vehicle
            // (nothing to add here)
        });
    }
}
