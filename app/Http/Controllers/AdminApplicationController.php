<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\StudentApplication;

class AdminApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index()
{
    $applications = StudentApplication::with('user')
        ->select('id', 'user_id', 'birth_certificate', 'gov_id', 'id_picture', 'marriage_contract', 'status', 'admin_remarks', 'created_at')
        ->latest()
        ->paginate(5);

    return Inertia::render('Admin/Applicants', [
        'applications' => $applications,
        'success' => session('success'),
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
        //
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
        // dd($request->all());
         $request->validate([
        'status' => 'required|in:approved,rejected',
        'admin_remarks' => 'nullable|string|max:500',
    ]);

    $application = StudentApplication::findOrFail($id);
    $application->status = $request->status;
    $application->admin_remarks = $request->admin_remarks;
    $application->save();

    return to_route('admin.applicants.index')
            ->with('success', 'Application  created successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
