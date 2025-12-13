<?php

use App\Http\Controllers\ExamController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AssignedStudentsController;
use App\Http\Controllers\EvaluateStudentsController;
use App\Http\Controllers\ProfileController;



Route::middleware(['auth', 'verified', 'instructor'])->prefix('instructor')->name('instructor.')->group(function () {
    Route::resource('assignedStudents', AssignedStudentsController::class);
    Route::resource('evaluateStudents',EvaluateStudentsController::class);
      Route::get('/evaluated-students', [EvaluateStudentsController::class, 'evaluatedIndex'])
            ->name('evaluatedStudents.index');
      Route::get('/profile', [ProfileController::class, 'instructor'])->name('profile.instructor');
      Route::resource('exam', ExamController::class);
       Route::put('/exam/{schedule}/start', [ExamController::class, 'start'])
    ->name('exam.start');

});
