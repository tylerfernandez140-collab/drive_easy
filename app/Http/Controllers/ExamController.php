<?php

namespace App\Http\Controllers;

use App\Models\CourseRegistration;
use App\Models\ExamAttempt;
use App\Models\ExamQuestion;
use App\Models\StudentEvaluation;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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
    $request->validate([
        'course_registration_id' => 'required|exists:course_registrations,id',
        'answers' => 'required|array',
        'question_ids' => 'sometimes|array',
        'question_ids.*' => 'integer|exists:exam_questions,id',
    ]);

    $student = Auth::user();

    $courseRegistration = CourseRegistration::with('studentApplication')
        ->where('id', $request->course_registration_id)
        ->whereHas('studentApplication', function ($query) use ($student) {
            $query->where('user_id', $student->id);
        })
        ->first();

    if (!$courseRegistration) {
        return redirect()->back()->with('error', 'Course registration not found for this student.');
    }

    if ($courseRegistration->course_type !== 'Theoretical') {
        return redirect()->back()->with('error', 'This exam is only available for theoretical courses.');
    }

    $questionIds = $request->input('question_ids', array_keys($request->answers));

    $questions = ExamQuestion::whereIn('id', $questionIds)->get();
    // $questions = ExamQuestion::all();

    if ($questions->isEmpty()) {
        return redirect()->back()->with('error', 'No questions found for this exam.');
    }

    $scores = [];
    $totalPoints = $questions->sum('points');
    $earnedPoints = 0;

    foreach ($questions as $question) {
        $submittedAnswer = $request->answers[$question->id] ?? null;
        $isCorrect = $submittedAnswer === $question->correct_answer;

        $scores[$question->id] = [
            'submitted' => $submittedAnswer,
            'correct' => $isCorrect,
        ];

        if ($isCorrect) {
            $earnedPoints += $question->points;
        }
    }

    $percentage = $totalPoints > 0 ? ($earnedPoints / $totalPoints) * 100 : 0;
    $status = $percentage >= 75 ? 'PASSED' : 'FAILED';

    $latestAttempt = ExamAttempt::where('student_id', $student->id)
        ->orderByDesc('created_at')
        ->first();
    $attemptNumber = $latestAttempt ? $latestAttempt->attempt_number + 1 : 1;

    ExamAttempt::create([
        'student_id' => $student->id,
        'score' => $earnedPoints,
        'status' => $status,
        'attempt_number' => $attemptNumber,
    ]);

    // Attempt to find a schedule for the course registration
    $schedule = $courseRegistration->schedules()->first();

    $evaluationData = [
        'instructor_notes' => $status === 'PASSED'
            ? 'Student passed theoretical exam.'
            : 'Student failed. Retake required.',
        'course_type' => $courseRegistration->course_type,
        'scores' => $scores,
        'total_score' => $earnedPoints,
        'remark' => $status,
    ];

    if ($schedule) {
        $evaluationData['schedule_id'] = $schedule->id;
        $schedule->update(['exam_status' => 'completed']);
    } else {
        $schedule = Schedule::where('instructor_id', $student->id)
            ->latest()
            ->first();
        if ($schedule) {
            $schedule->update(['exam_status' => 'completed']);
            $evaluationData['schedule_id'] = $schedule->id;
        }
    }

    StudentEvaluation::updateOrCreate(
        [
            'student_id' => $student->id,
            'course_registration_id' => $courseRegistration->id,
        ],
        $evaluationData
    );
 $courseRegistration->update([
        'course_status' => 'completed',
    ]);
    
    return redirect()->back()->with([
        'result' => [
            'score' => $earnedPoints,
            'total' => $totalPoints,
            'percentage' => round($percentage, 2),
            'status' => $status,
        ]
    ]);
}






    /**
     * Display the specified resource.
     */


public function show()
{
    $studentId = Auth::id();
    $student   = Auth::user();

    $courseRegistration = $student->studentApplication->courseRegistrations()
        ->where('course_type', 'Theoretical')
        ->latest()
        ->first();

    if (!$courseRegistration) {
        return redirect()->back()->with('error', 'No theoretical course registration found.');
    }

    $latestAttempt = ExamAttempt::where('student_id', $studentId)
        ->orderByDesc('created_at')
        ->first();

    $result = session('result');

    if (!$result && $latestAttempt) {
        $totalPoints = ExamQuestion::sum('points');
        $percentage = $totalPoints > 0
            ? ($latestAttempt->score / $totalPoints) * 100
            : 0;

        $result = [
            'score'      => $latestAttempt->score,
            'total'      => $totalPoints,
            'percentage' => round($percentage, 2),
            'status'     => $latestAttempt->status,
        ];
    }
  $questions = ExamQuestion::limit(10)->get()->map(function ($q) {
    return [
        'id'       => $q->id,
        'question' => $q->question,
        'choices'  => is_string($q->choices) ? json_decode($q->choices, true) : $q->choices,
    ];
});



    return Inertia::render('Student/TheoreticalExam', [
        'student'                => $student,
        'questions'              => $questions,
        'result'                 => $result,
        'error'                  => session('error'),
        'course_registration_id' => $courseRegistration->id,
    ]);
}





    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */


public function update(Request $request, $scheduleId)
{
    $exam = Schedule::findOrFail($scheduleId);
    $courseRegistration = $exam->courseRegistration;

    $validated = $request->validate([
        'exam_status' => 'required|in:not_started,in_progress,completed,force_started',
    ]);

    // Apply the update based on the validated status
    $exam->update(['exam_status' => $validated['exam_status']]);

    // If the exam status is completed, also update the course registration status
    if ($validated['exam_status'] === 'completed') {
        $courseRegistration->update(['course_status' => 'completed']);
    }

    return back()->with('success', 'Exam status updated to ' . $exam->exam_status);
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
