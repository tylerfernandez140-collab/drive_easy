<?php

use App\Http\Controllers\HeroController;
use App\Http\Controllers\ProfileController;
use App\Models\Schedule;
use App\Models\StudentApplication;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Models\Hero;
use Inertia\Inertia;
use App\Http\Controllers\Auth\EmailVerificationCodeController;

Route::get('/', function () {
     $hero = Hero::first();
    return Inertia::render('Welcome', [
        'hero' => $hero,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// routes/web.php
// routes/web.php


Route::middleware(['auth', 'verified.email'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});
Route::get('/email/verify-code', [EmailVerificationCodeController::class, 'showVerifyForm'])
    ->name('verification.code.notice');

Route::post('/email/verify-code', [EmailVerificationCodeController::class, 'verify'])
    ->name('verification.code.verify');

Route::post('/email/resend-code', [EmailVerificationCodeController::class, 'resend'])
    ->name('verification.code.resend');

Route::get('/dashboard', function () {
    if (Auth::check()) {
        switch (Auth::user()->role) {
            case 'admin':
                return redirect('/admin/dashboard');
            case 'instructor':
                return redirect('/instructor/dashboard');
        }
        $user = Auth::user();
        $schedules = Schedule::with(['instructor', 'courseRegistration.studentApplication'])
            ->whereHas('courseRegistration.studentApplication', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->latest()
            ->get();
              $application = StudentApplication::where('user_id', $user->id)->first();
        return Inertia::render('Dashboard', [
            'schedule' => $schedules,
            'application' => $application,
        ]);
    }

    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');



Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
})->middleware(['auth', 'verified', 'admin'])->name('admin.dashboard');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/landing-page', [HeroController::class, 'index'])->name('admin.landing');
    Route::post('/admin/landing-page/update', [HeroController::class, 'update'])->name('admin.landing.update');
});


Route::get('/instructor/dashboard', function () {
    return Inertia::render('Instructor/Dashboard');
})->middleware(['auth', 'verified', 'instructor'])->name('instructor.dashboard');
       
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
require __DIR__.'/instructor.php';
require __DIR__.'/admin.php';
require __DIR__.'/student.php';
require __DIR__.'/auth.php';