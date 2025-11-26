<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationCodeMail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationCodeController extends Controller
{
    /**
     * Show the email verification code form.
     */
    public function showVerifyForm(Request $request): Response|RedirectResponse
    {
        $userId = $request->session()->get('verify_user_id');

        if (!$userId) {
            // No pending verification, go back to register
            return redirect()->route('register');
        }

        $user = User::find($userId);

        if (!$user) {
            return redirect()->route('register')
                ->withErrors(['code' => 'User not found. Please register again.']);
        }

        // If already verified, just log them in and send to dashboard
        if ($user->email_verified_at) {
            Auth::login($user);
            $request->session()->forget('verify_user_id');

            return redirect()->route('dashboard')
                ->with('status', 'Your email is already verified.');
        }

        return Inertia::render('Auth/VerifyEmailCode', [
            'status'      => session('status'),
            'email'       => $user->email,
            'expires_at'  => $user->email_verification_expires_at,
        ]);
    }

    /**
     * Verify the submitted code.
     */
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

        // Check expiry
        if (now()->greaterThan($user->email_verification_expires_at)) {
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

        // Log them in
        Auth::login($user);

        return redirect()->route('dashboard')
            ->with('status', 'Email verified successfully!');
    }

    /**
     * Resend a new verification code.
     */
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

        if ($user->email_verified_at) {
            // Already verified — no need to send new code
            return redirect()->route('dashboard')
                ->with('status', 'Your email is already verified.');
        }

        $code = random_int(100000, 999999);

        $user->email_verification_code = Hash::make($code);
        // Match your registration expiry (5 minutes)
        $user->email_verification_expires_at = now()->addMinutes(5);
        $user->save();

        Mail::to($user->email)->send(new EmailVerificationCodeMail((string) $code));

        return back()->with('status', 'A new verification code has been sent to your email.');
    }
}
