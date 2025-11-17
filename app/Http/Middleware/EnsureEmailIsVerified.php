<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If logged in but not verified, redirect to the verify-code page
        if ($user && is_null($user->email_verified_at)) {
            return redirect()
                ->route('verification.code.notice')
                ->with('status', 'You must verify your email first.');
        }

        return $next($request);
    }
}
