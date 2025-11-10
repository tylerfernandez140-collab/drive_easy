// resources/js/Pages/Auth/VerifyEmailCode.jsx

import { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import InputLabel from '@/Components/ui/Input/InputLabel';
import TextInput from '@/Components/ui/Input/TextInput';
import InputError from '@/Components/ui/Input/InputError';
import PrimaryButton from '@/Components/ui/Button/PrimaryButton';


const RESEND_TIMEOUT = 300;

export default function VerifyEmailCode() {
    const { props } = usePage();
    const { status } = props;

    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT);

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.code.verify'));
    };

    const resendCode = () => {
        if (secondsLeft > 0) return;

        post(route('verification.code.resend'), {
            preserveScroll: true,
            onSuccess: () => {
                setSecondsLeft(RESEND_TIMEOUT);
            },
        });
    };

    useEffect(() => {
        if (secondsLeft <= 0) return;

        const interval = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [secondsLeft]);

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const isResendDisabled = processing || secondsLeft > 0;

    return (
        <GuestLayout>
            <Head title="Verify Email" />

            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">
                    Verify your email
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    We’ve sent a one-time verification code to your email address.
                    Enter the code below to activate your account. The code will expire in 5 minutes.
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-md border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {status}
                </div>
            )}

            <div className="mb-4 rounded-xl border border-gray-100 bg-white/70 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-5 sm:gap-6">
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 shadow-sm">
                            <span className="text-base font-bold text-indigo-700 tracking-wide">
                                {formatTime(secondsLeft)}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                                Code Validity Period
                            </span>
                            <span className="mt-1 text-[15px] text-gray-700 leading-relaxed">
                                You can request a new code once the timer reaches zero.
                            </span>
                        </div>
                    </div>


                    <div className="flex flex-col items-start gap-1 sm:items-end">
                        <button
                            type="button"
                            onClick={resendCode}
                            className={`text-sm font-medium ${isResendDisabled
                                ? 'cursor-not-allowed text-gray-400'
                                : 'text-indigo-600 hover:text-indigo-700'
                                } underline-offset-4 hover:underline`}
                            disabled={isResendDisabled}
                        >
                            {secondsLeft > 0
                                ? `Resend available in ${formatTime(secondsLeft)}`
                                : 'Resend code'}
                        </button>
                        <span className="text-xs text-gray-400">
                            Check spam or promotions if you don’t see the email.
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="code" value="Verification Code" />

                    <TextInput
                        id="code"
                        type="text"
                        name="code"
                        value={data.code}
                        className="mt-1 block w-full tracking-[0.35em] text-center text-lg font-semibold"
                        autoComplete="one-time-code"
                        isFocused={true}
                        onChange={(e) => setData('code', e.target.value)}
                        required
                        maxLength={6}
                    />

                    <p className="mt-2 text-xs text-gray-500">
                        Enter the 6-digit code we emailed to you.
                    </p>

                    <InputError message={errors.code} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <Link
                        href={route('register')}
                        className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
                    >
                        Back to register
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Verify
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
