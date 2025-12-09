<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Schedule;
use App\Models\CourseRegistration;
use App\Models\StudentApplication;

class FixNullScheduleCourseRegistration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'schedule:fix-null-registration';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix existing schedules with null course_registration_id by matching to correct course registrations';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $schedules = Schedule::where('exam_status', 'not_started')->get();

        if ($schedules->isEmpty()) {
            $this->info('No schedules with null course_registration_id found.');
            return Command::SUCCESS;
        }

        $this->info("Found {$schedules->count()} schedules with not_started exam_status. Starting remediation...");

        foreach ($schedules as $schedule) {
            // Match by instructor and course type (theoretical/practical)
            $courseType = $schedule->vehicle_id ? 'Practical' : 'Theoretical';

            $matchingCourseRegistration = CourseRegistration::where('course_type', $courseType)
                ->whereHas('schedules', function ($query) use ($schedule) {
                    $query->where('instructor_id', $schedule->instructor_id)
                        ->where('date', $schedule->date)
                        ->where('time', $schedule->time)
                        ->where('vehicle_id', $schedule->vehicle_id);
                })
                ->first();

            if ($matchingCourseRegistration) {
                $schedule->update(['course_registration_id' => $matchingCourseRegistration->id]);
                $this->line("Fixed schedule {$schedule->id} with course_registration_id {$matchingCourseRegistration->id}");
            } else {
                $this->warn("Could not find matching course registration for schedule {$schedule->id}");
            }
        }

        $this->info('Remediation process completed.');
        return Command::SUCCESS;
    }
}