<?php

// app/Http/Controllers/Auth/EmailVerificationCodeController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationCodeMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationCodeController extends Controller
{
    public function showVerifyForm(Request $request): Response|RedirectResponse
    {
        $userId = $request->session()->get('verify_user_id');

        if (!$userId) {
            // nothing in session; maybe redirect to login or register
            return redirect()->route('register');
        }

        return Inertia::render('Auth/VerifyEmailCode', [
            'status' => session('status'),
        ]);
    }

    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $userId = $request->session()->get('verify_user_id');

        if (!$userId) {
            return redirect()->route('register')
                ->withErrors(['code' => 'Your verification session has expired. Please register again.']);
        }

        $user = User::find($userId);

        if (!$user) {
            return redirect()->route('register')
                ->withErrors(['code' => 'User not found.']);
        }

        if (!$user->email_verification_code || !$user->email_verification_expires_at) {
            return back()->withErrors(['code' => 'No verification code found. Please request a new one.']);
        }

        if (Carbon::parse($user->email_verification_expires_at)->isPast()) {
            return back()->withErrors(['code' => 'Your verification code has expired. Please request a new one.']);
        }

        // Check code
        if (!Hash::check($request->code, $user->email_verification_code)) {
            return back()->withErrors(['code' => 'Invalid verification code.']);
        }

        // Mark email as verified
        $user->email_verified_at = now();
        $user->email_verification_code = null;
        $user->email_verification_expires_at = null;
        $user->save();

        // Clear session
        $request->session()->forget('verify_user_id');

        // Log them in now
        Auth::login($user);

        return redirect()->route('dashboard')->with('status', 'Email verified successfully!');
    }

    public function resend(Request $request): RedirectResponse
    {
        $userId = $request->session()->get('verify_user_id');

        if (!$userId) {
            return redirect()->route('register')
                ->withErrors(['code' => 'Your verification session has expired. Please register again.']);
        }

        $user = User::find($userId);

        if (!$user) {
            return redirect()->route('register')
                ->withErrors(['code' => 'User not found.']);
        }

        $code = random_int(100000, 999999);

        $user->email_verification_code = Hash::make($code);
        $user->email_verification_expires_at = now()->addMinutes(15);
        $user->save();

        Mail::to($user->email)->send(new EmailVerificationCodeMail((string) $code));

        return back()->with('status', 'A new verification code has been sent to your email.');
    }
}
