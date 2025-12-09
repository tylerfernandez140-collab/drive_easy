<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\StudentApplication;
use App\Models\Schedule;
use App\Models\StudentEvaluation;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function index()
{
    if (Auth::user()->role === 'admin') {
        $pendingApplications = StudentApplication::where('status', 'pending')->count();
        $upcomingSchedules = Schedule::where('date', '>=', Carbon::today())->count();
        $verifiedStudents = User::where('role', 'student')->where('is_verified', true)->count();
        $certificatesIssued = StudentEvaluation::where('status', 'PASSED')->count();

        return Inertia::render('Admin/Dashboard', [
            'users' => User::all(),
            'pendingApplications' => $pendingApplications,
            'upcomingSchedules' => $upcomingSchedules,
            'verifiedStudents' => $verifiedStudents,
            'certificatesIssued' => $certificatesIssued,
        ]);
    }

    return redirect('/login')->with('error', 'You do not have access to this page.');
}
}
