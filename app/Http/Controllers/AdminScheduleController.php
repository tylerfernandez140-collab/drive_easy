<?php

namespace App\Http\Controllers;
use App\Http\Requests\StoreScheduleRequest;
use App\Http\Resources\CourseRegistrationResource;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Schedule;
use App\Models\CourseRegistration;
use App\Models\Vehicle;
use Carbon\Carbon;
use App\Jobs\MakeVehicleAvailable; 

class AdminScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
public function index()
{
    // instructors
    $instructors = User::where('role', 'instructor')
        ->select('id', 'name')
        ->get();

    // registrations (you were already using a resource, keep it)
    $registrations = CourseRegistration::with([
        'studentApplication.user:id,name',
    ])->get();

    // schedules with relations
    $schedules = Schedule::with([
            'instructor:id,name',
            'courseRegistration.studentApplication.user:id,name',
            'vehicle:id,name,type,status',
        ])
        ->latest()
        ->get();

    // normalize so frontend can still use s.course_registration
    $schedules->transform(function ($schedule) {
        // add alias for Vue/React that expects course_registration
        $schedule->course_registration = $schedule->courseRegistration;
        return $schedule;
    });

    // vehicles
 $vehicles = Vehicle::active()
        ->orderBy('name')
        ->get(['id', 'name', 'type', 'status', 'unavailable_until']);
    // fixed slots to send to frontend (same as FE constant)
    $slots = [
        ['label' => '08:00 – 10:00 AM', 'value' => '08:00'],
        ['label' => '10:00 – 12:00 NN', 'value' => '10:00'],
        ['label' => '01:00 – 03:00 PM', 'value' => '13:00'],
        ['label' => '03:00 – 05:00 PM', 'value' => '15:00'],
    ];

    return Inertia::render('Admin/Schedules', [
        'instructors'   => $instructors,
        'registrations' => \App\Http\Resources\CourseRegistrationResource::collection($registrations)->resolve(),
        'schedules'     => $schedules,
        'vehicles'      => $vehicles,
        'slots'         => $slots,
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
public function store(StoreScheduleRequest $request)
{
    $validated = $request->validated();

    $date = $validated['date'];
    $instructorId = $validated['instructor_id'];
    $vehicleId = $validated['vehicle_id'] ?? null;
    $registrationId = $validated['course_registration_id'] ?? null;

    // 1. detect theoretical
    $isTheoretical = false;
    $reg = null;
    if ($registrationId) {
        $reg = \App\Models\CourseRegistration::find($registrationId);
        if ($reg && $reg->course_type) {
            $ct = strtolower($reg->course_type);
            if (str_contains($ct, 'theoretical') || str_contains($ct, 'theory')) {
                $isTheoretical = true;
            }
        }
    }

    // 2. only parse time for practical
    if (! $isTheoretical) {
        // FE sends "08:00" → make it "08:00:00"
        $dateTime = \Carbon\Carbon::parse($validated['date'] . ' ' . ($validated['time'] ?? '00:00'), 'Asia/Manila');
        $validated['time'] = $dateTime->format('H:i:s');
    } else {
        // theory: force a safe value
        $validated['time'] = null; // or '00:00:00'
    }

    $time = $validated['time']; // might be null for theory

    // 3. conflicts
    if (! $isTheoretical) {
        // instructor conflict (practical only)
        $instructorConflict = \App\Models\Schedule::where('date', $date)
            ->where('time', $time)
            ->where('instructor_id', $instructorId)
            ->exists();

        if ($instructorConflict) {
            return back()
                ->withErrors(['instructor_id' => 'This instructor already has a schedule in this time slot.'])
                ->withInput();
        }
    }

    // student conflict still ok for both
    if ($registrationId) {
        $studentConflict = \App\Models\Schedule::where('date', $date)
            ->when(! $isTheoretical, fn ($q) => $q->where('time', $time)) // for practical
            ->where('course_registration_id', $registrationId)
            ->exists();

        if ($studentConflict) {
            return back()
                ->withErrors(['course_registration_id' => 'This student already has a schedule for this time slot.'])
                ->withInput();
        }
    }

    // max 4/day → practical only
    if (! $isTheoretical) {
        $instructorDayCount = \App\Models\Schedule::where('date', $date)
            ->where('instructor_id', $instructorId)
            ->count();

        if ($instructorDayCount >= 4) {
            return back()
                ->withErrors(['instructor_id' => 'This instructor has reached the maximum of 4 students for this day.'])
                ->withInput();
        }
    }

    // 4. create
    $schedule = \App\Models\Schedule::create($validated);

    // 5. lock vehicle → practical only
    if (! $isTheoretical && $vehicleId) {
        $vehicle = \App\Models\Vehicle::find($vehicleId);

        if ($vehicle) {
            $until = now()->addHours(2);

            $vehicle->update([
                'status' => 'unavailable',
                'unavailable_until' => $until,
            ]);

            \App\Jobs\MakeVehicleAvailable::dispatch($vehicle->id)->delay($until);
        }
    }

    return redirect()
        ->route('admin.schedules.index')
        ->with('success', 'Schedule created successfully.');
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
