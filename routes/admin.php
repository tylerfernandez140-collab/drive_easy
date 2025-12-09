<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminApplicationController;
use App\Http\Controllers\ManageMaterialController;
use App\Http\Controllers\AdminScheduleController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard', function () {
        $pendingApplicationsCount = App\Models\StudentApplication::where('status', 'pending')->count();
        $verifiedStudentsCount = App\Models\StudentApplication::where('status', 'approved')->count();
        $upcomingSchedules = App\Models\Schedule::with(['instructor', 'courseRegistration.studentApplication.user', 'vehicle'])
            ->where(function ($query) {
                $query->where('date', '>', now()->toDateString())
                      ->orWhere(function ($query) {
                          $query->where('date', now()->toDateString())
                                ->where('time', '>', now()->toTimeString());
                      });
            })->whereIn('exam_status', ['not_started', 'in_progress'])->get();

        $pendingApplications = App\Models\StudentApplication::with('user')->where('status', 'pending')->get();
        $verifiedStudents = App\Models\StudentApplication::with('user')->where('status', 'approved')->get();
        $certificatesIssued = App\Models\CourseRegistration::with('studentApplication.user')->select('id', 'student_application_id', 'course_type', 'course_status', 'admin_remarks', 'created_at')->get();

        return Inertia::render('Admin/Dashboard', [
            'pendingApplicationsCount' => $pendingApplicationsCount,
            'verifiedStudentsCount' => $verifiedStudentsCount,
            'pendingApplications' => $pendingApplications,
            'verifiedStudents' => $verifiedStudents,
            'upcomingSchedules' => $upcomingSchedules,
            'certificatesIssued' => $certificatesIssued,
        ]);
    })->name('dashboard');

    Route::get('/dashboard/pending-applications', function () {
        $pendingApplicationsData = App\Models\StudentApplication::with('user')->where('status', 'pending')->get();
        return response()->json($pendingApplicationsData);
    })->name('dashboard.pendingApplicationsData');

    Route::get('/dashboard/verified-students', function () {
        $verifiedStudentsData = App\Models\StudentApplication::with('user')->where('status', 'approved')->get();
        return response()->json($verifiedStudentsData);
    })->name('dashboard.verifiedStudentsData');

    Route::get('/dashboard/upcoming-schedules', function () {
        try {
            $upcomingSchedulesData = App\Models\Schedule::with(['instructor', 'courseRegistration.studentApplication.user', 'vehicle'])
                ->where(function ($query) {
                    $query->where('date', '>', now()->toDateString())
                          ->orWhere(function ($query) {
                              $query->where('date', now()->toDateString())
                                    ->where('time', '>', now()->toTimeString());
                          });
                })->whereIn('exam_status', ['not_started', 'in_progress'])->get();
            return response()->json($upcomingSchedulesData);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()], 500);
        }
    })->name('dashboard.upcomingSchedulesData');

    Route::get('/dashboard/certificates-issued', function () {
        try {
            $certificatesIssuedData = App\Models\CourseRegistration::with('studentApplication.user')->select('id', 'student_application_id', 'course_type', 'course_status', 'admin_remarks', 'created_at')->get();
            return response()->json($certificatesIssuedData);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()], 500);
        }
    })->name('dashboard.certificatesIssuedData');

    Route::resource('applicants', AdminApplicationController::class);
    Route::resource('schedules', AdminScheduleController::class);
    Route::get('/performance', fn () =>
        Inertia::render('Admin/PerformanceRating')
    )->name('performance');
      Route::resource('materials', ManageMaterialController::class);
      Route::resource('users', UserController::class);
Route::post('/instructors', [UserController::class, 'storeInstructor'])->name('admin.instructors.store');
      Route::get('/certificates', fn () =>
        Inertia::render('Admin/Certificates')
    )->name('certificates');
   Route::get('/certificates', [CertificateController::class, 'index'])->name('admin.certificates.index');
    Route::post('/certificates/{id}/revoke', [CertificateController::class, 'revoke'])->name('admin.certificates.revoke');
    Route::post('/certificates/{id}/reissue', [CertificateController::class, 'reissue'])->name('admin.certificates.reissue');
 Route::get('profile', [ProfileController::class, 'admin'])->name('profile.admin');
});
