<?php

namespace App\Http\Controllers;

use App\Models\CourseRegistration;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\StudentEvaluation;
use App\Models\Schedule;
use App\Models\StudentApplication;

class EvaluateStudentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
    return Inertia::render('Instructor/EvaluateStudents', [
            'students' => [], 
            'success' => session('success'),
          
        ]);
    }
    public function evaluatedIndex()
{
    $instructorId = Auth::id();

    $evaluations = StudentEvaluation::with([
        'student',
        'courseRegistration.studentApplication.user',
        'courseRegistration.schedules',
    ])
        // ->where('instructor_id', $instructorId) // uncomment if you have this column
        ->latest()
        ->get();

    return Inertia::render('Instructor/EvaluatedStudents', [
        'evaluations' => $evaluations,
        'success'     => session('success'),
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
public function store(Request $request)
{
    $validated = $request->validate([
        'student_id' => 'required|exists:users,id',
        'course_type' => 'required|string|in:theoretical,practical',
        'scores' => 'required|array',
        'total_score' => 'required|integer',
        'remark' => 'nullable|string',
        'instructor_notes' => 'nullable|string',
    ]);

    $studentApplication = StudentApplication::where('user_id', $request->student_id)->first();

    if (! $studentApplication) {
        return back()->withErrors(['student_id' => 'No student application found for this user.']);
    }

    $courseRegistration = CourseRegistration::where('student_application_id', $studentApplication->id)
        ->where('course_type', $request->course_type)
        ->first();

    if (! $courseRegistration) {
        return back()->withErrors(['course_type' => 'No course registration found for this student with the given type.']);
    }

    // Attempt to find a schedule for the course registration
    $schedule = $courseRegistration->schedules()->first();

    if (! $schedule) {
        return back()->withErrors(['schedule' => 'No schedule found for this course registration. Please assign a schedule before evaluating.']);
    }

    \Illuminate\Support\Facades\Log::info('Processing CourseRegistration ID: ' . $courseRegistration->id);
    \Illuminate\Support\Facades\Log::info('Found schedule ID: ' . ($schedule ? $schedule->id : 'null'));

    $status = $validated['total_score'] >= 75 ? 'PASSED' : 'FAILED';

    $validated['instructor_notes'] = $status === 'PASSED'
        ? "Student passed the {$validated['course_type']} exam."
        : "Student failed the {$validated['course_type']} exam. Retake required.";

    $validated['course_registration_id'] = $courseRegistration->id;
    $validated['remark'] = $status;

    // If a schedule is found, use its ID; otherwise, set schedule_id to null
    $validated['schedule_id'] = $schedule ? $schedule->id : null;
    $validated['evaluated_by'] = Auth::id(); // Store current instructor's ID

    $evaluation = StudentEvaluation::create($validated);

    // Update the schedule's exam_status to 'completed'
    if ($schedule) {
        $schedule->update(['exam_status' => 'completed']);
    }

    $courseRegistration->update(['course_status' => 'completed']);
    return back()->with('success', 'Evaluation saved and course status updated!');
}




    /**
     * Display the specified resource.
     */
public function show(Request $request, string $id)
{
    $selectedCourseType = $request->query('courseType'); 

    $student = User::with([
        'studentApplication.courseRegistrations' => function($query) {
            $query->select('id', 'student_application_id', 'course_type');
        }
    ])->findOrFail($id);

    return Inertia::render('Instructor/EvaluateStudents', [
        'student' => $student->loadMissing('studentApplication.courseRegistrations'),
        'courseType' => $selectedCourseType,
        'success' => session('success'),
    ]);
}
public function downloadCertificate(Request $request)
{
    $courseType = $request->query('courseType');
    $studentId = Auth::id();

    $evaluation = StudentEvaluation::with(['evaluatedBy', 'schedule.instructor', 'courseRegistration'])
        ->where('student_id', $studentId)
        ->where('course_type', $courseType)
        ->first();

    if (!$evaluation) {
        abort(404, 'Certificate not available.');
    }

    $courseDuration = 'N/A';
    if ($courseType === 'theoretical') {
        $courseDuration = '15 hours';
    } elseif ($courseType === 'practical') {
        $courseDuration = '8 hours';
    }

    $instructorName = 'DriveEasy Representative';
    // Prioritize direct evaluatedBy relation (works even with null schedule_id)
    if ($evaluation->evaluatedBy) {
        $instructorName = $evaluation->evaluatedBy->first_name . ' ' . $evaluation->evaluatedBy->last_name;
    } elseif ($evaluation->schedule && $evaluation->schedule->instructor) {
        $instructorName = $evaluation->schedule->instructor->first_name . ' ' . $evaluation->schedule->instructor->last_name;
    }

    $pdf = app('dompdf.wrapper');
    $pdf->loadView('certificate', [
        'student' => Auth::user(),
        'courseType' => $courseType,
        'evaluation' => $evaluation,
        'courseDuration' => $courseDuration,
        'logo' => public_path('images/cert-logo.png'),
        'instructorName' => $instructorName,
    ]);

   return $pdf->stream("Certificate-{$courseType}.pdf");

}


    /**
     * Show the form for editing the specified resource.
     */
   public function edit($id)
{
   //
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
