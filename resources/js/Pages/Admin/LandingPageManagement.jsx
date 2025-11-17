import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { toast, Toaster } from 'react-hot-toast';
import { FaRegCalendar, FaRegCheckCircle, FaRegUser } from 'react-icons/fa';

export default function LandingPageManagement({ hero }) {
    const { data, setData, post, processing, errors } = useForm({
        tagline: hero?.tagline || '',
        heading: hero?.heading || '',
        highlight: hero?.highlight || '',
        description: hero?.description || '',
        // ✅ new feature fields
        feature_one_title: hero?.feature_one_title || '',
        feature_one_description: hero?.feature_one_description || '',
        feature_two_title: hero?.feature_two_title || '',
        feature_two_description: hero?.feature_two_description || '',
        feature_three_title: hero?.feature_three_title || '',
        feature_three_description: hero?.feature_three_description || '',
        icon: null,
    });

    const [preview, setPreview] = useState(
        hero?.icon_path ? `/storage/${hero.icon_path}` : null
    );

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('icon', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('admin.landing.update'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Landing page updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update hero section. Please check the form.');
            },
        });
    };

    // small helper so preview always has something to show
    const safeTagline = data.tagline || '🚗 Your Journey Starts Here';
    const safeHeading = data.heading || 'Master the Road with';
    const safeHighlight = data.highlight || 'DriveEasy';
    const safeDescription =
        data.description ||
        'Transform your driving skills with expert guidance, smart scheduling, and personalized feedback. Your path to confident, safe driving starts today.';

    // ✅ feature fallbacks for preview
    const f1Title = data.feature_one_title || 'Expert Instructors';
    const f1Desc =
        data.feature_one_description || 'Personal guidance from certified trainers.';
    const f2Title = data.feature_two_title || 'Smart Scheduling';
    const f2Desc =
        data.feature_two_description || 'Flexible training calendar for students.';
    const f3Title = data.feature_three_title || 'Performance Tracking';
    const f3Desc =
        data.feature_three_description || 'Monitor progress across sessions.';

    return (
        <AdminLayout>
            <Head title="Landing Page Management" />
            <Toaster position="top-right" reverseOrder={false} />

            <div className="min-h-screen bg-slate-50/70 py-10 px-4 md:px-8">
                <div className="mx-auto max-w-6xl">
                    {/* Page header */}
                    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                                Website / landing
                            </p>
                            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                                Landing Page Management
                            </h1>
                            <p className="text-sm text-slate-500">
                                Update the hero content that appears on your public site.
                            </p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            Admin access
                        </span>
                    </div>

                    {/* 2-column: form + live preview */}
                    <div className="grid gap-6 lg:grid-cols-2 items-start">
                        {/* FORM CARD */}
                        <div className="rounded-3xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur">
                            <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-6 py-4">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900">
                                        Hero content
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Fill in the fields below. All fields are editable anytime.
                                    </p>
                                </div>
                            </div>

                            <form
                                id="hero-form"
                                onSubmit={handleSubmit}
                                className="px-6 py-7 space-y-8"
                            >
                                {/* Icon uploader */}
                                <div>
                                    <h3 className="text-sm font-medium text-slate-900 mb-2">
                                        Company Icon / Image
                                    </h3>
                                    <p className="text-xs text-slate-400 mb-3">
                                        This is usually shown beside your headline. Recommended
                                        256×256px.
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-[0.6rem] text-slate-400">
                                                    No image
                                                </span>
                                            )}
                                        </div>

                                        <label className="group cursor-pointer">
                                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-3 text-sm font-medium text-slate-600 transition group-hover:border-slate-400 group-hover:bg-slate-100">
                                                Upload / Change image
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleIconChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {errors.icon && (
                                        <p className="mt-1 text-xs text-red-500">{errors.icon}</p>
                                    )}
                                </div>

                                {/* Text fields */}
                                <div className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Tagline */}
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-800">
                                                Tagline
                                            </label>
                                            <input
                                                type="text"
                                                value={data.tagline}
                                                onChange={(e) => setData('tagline', e.target.value)}
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                                                placeholder="🚗 Your Journey Starts Here"
                                            />
                                            {errors.tagline && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.tagline}
                                                </p>
                                            )}
                                        </div>

                                        {/* Heading */}
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-800">
                                                Heading
                                            </label>
                                            <input
                                                type="text"
                                                value={data.heading}
                                                onChange={(e) => setData('heading', e.target.value)}
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                                                placeholder="Master the Road with"
                                            />
                                            {errors.heading && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.heading}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Highlight */}
                                    <div className="md:w-1/2">
                                        <label className="mb-1 block text-sm font-medium text-slate-800">
                                            Highlighted word
                                        </label>
                                        <input
                                            type="text"
                                            value={data.highlight}
                                            onChange={(e) => setData('highlight', e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                                            placeholder="DriveEasy"
                                        />
                                        {errors.highlight && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.highlight}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-800">
                                            Description
                                        </label>
                                        <textarea
                                            rows="4"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                                            placeholder="Explain what your landing is about."
                                        ></textarea>
                                        {errors.description && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* ✅ Features section */}
                                <div className="space-y-4 border-t border-slate-100 pt-5">
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Feature cards (3)
                                    </h3>

                                    {/* Feature 1 */}
                                    <div className="space-y-2">
                                        <p className="text-xs text-slate-400">Feature 1</p>
                                        <input
                                            type="text"
                                            value={data.feature_one_title}
                                            onChange={(e) =>
                                                setData('feature_one_title', e.target.value)
                                            }
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                                            placeholder="e.g. Expert Instructors"
                                        />
                                        <textarea
                                            rows="2"
                                            value={data.feature_one_description}
                                            onChange={(e) =>
                                                setData('feature_one_description', e.target.value)
                                            }
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                                            placeholder="Short description for this feature"
                                        ></textarea>
                                    </div>

                                    {/* Feature 2 */}
                                    <div className="space-y-2">
                                        <p className="text-xs text-slate-400">Feature 2</p>
                                        <input
                                            type="text"
                                            value={data.feature_two_title}
                                            onChange={(e) =>
                                                setData('feature_two_title', e.target.value)
                                            }
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                                            placeholder="e.g. Smart Scheduling"
                                        />
                                        <textarea
                                            rows="2"
                                            value={data.feature_two_description}
                                            onChange={(e) =>
                                                setData('feature_two_description', e.target.value)
                                            }
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                                            placeholder="Short description for this feature"
                                        ></textarea>
                                    </div>

                                    {/* Feature 3 */}
                                    <div className="space-y-2">
                                        <p className="text-xs text-slate-400">Feature 3</p>
                                        <input
                                            type="text"
                                            value={data.feature_three_title}
                                            onChange={(e) =>
                                                setData('feature_three_title', e.target.value)
                                            }
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                                            placeholder="e.g. Performance Tracking"
                                        />
                                        <textarea
                                            rows="2"
                                            value={data.feature_three_description}
                                            onChange={(e) =>
                                                setData('feature_three_description', e.target.value)
                                            }
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                                            placeholder="Short description for this feature"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Footer actions */}
                                <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-slate-400">
                                        You can update this anytime. Changes will reflect immediately.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
                                            onClick={() => {
                                                setData({
                                                    tagline: hero?.tagline || '',
                                                    heading: hero?.heading || '',
                                                    highlight: hero?.highlight || '',
                                                    description: hero?.description || '',
                                                    feature_one_title: hero?.feature_one_title || '',
                                                    feature_one_description:
                                                        hero?.feature_one_description || '',
                                                    feature_two_title: hero?.feature_two_title || '',
                                                    feature_two_description:
                                                        hero?.feature_two_description || '',
                                                    feature_three_title:
                                                        hero?.feature_three_title || '',
                                                    feature_three_description:
                                                        hero?.feature_three_description || '',
                                                    icon: null,
                                                });
                                                setPreview(
                                                    hero?.icon_path
                                                        ? `/storage/${hero.icon_path}`
                                                        : null
                                                );
                                                const formEl =
                                                    document.querySelector('#hero-form');
                                                if (formEl) formEl.reset();
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-xl text-nowrap bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
                                        >
                                            {processing ? 'Saving…' : 'Save changes'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* LIVE PREVIEW PANEL */}
                        <div className="rounded-3xl border border-slate-200 bg-slate-900/5 overflow-hidden min-h-[560px]">
                            <div className="border-b border-slate-200/60 px-5 py-3 bg-white/60 backdrop-blur flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-400">
                                        Live preview
                                    </p>
                                    <p className="text-sm font-medium text-slate-900">
                                        How it looks on the public page
                                    </p>
                                </div>
                                <span className="text-[10px] rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">
                                    auto-updating
                                </span>
                            </div>

                            {/* mimic your actual Welcome UI */}
                            <div className="relative min-h-[520px] bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
                                {/* blobs */}
                                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                                <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>

                                <div className="relative z-10 px-5 py-8">
                                    {/* icon */}
                                    <div className="text-center mb-5">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt={safeHighlight}
                                                className="mx-auto w-16 h-16 object-contain mb-3 drop-shadow"
                                            />
                                        ) : null}

                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-[11px] font-medium text-blue-700">
                                            {safeTagline}
                                        </span>
                                    </div>

                                    <h2 className="text-center text-3xl font-bold text-slate-900 leading-tight mb-3">
                                        {safeHeading}{' '}
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {safeHighlight}
                                        </span>
                                    </h2>

                                    <p className="text-center text-sm text-slate-600 max-w-xl mx-auto mb-6">
                                        {safeDescription}
                                    </p>

                                    {/* fake CTAs */}
                                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                                        <button className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium shadow">
                                            Get Started
                                        </button>
                                        <button className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-white/80 text-sm text-slate-700">
                                            Create an account
                                        </button>
                                    </div>


                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <PreviewFeature
                                            icon={<FaRegUser className="w-5 h-5 text-white" />}
                                            title={f1Title}
                                            desc={f1Desc}
                                        />
                                        <PreviewFeature
                                            icon={<FaRegCalendar className="w-5 h-5 text-white" />}
                                            title={f2Title}
                                            desc={f2Desc}
                                        />
                                        <PreviewFeature
                                            icon={<FaRegCheckCircle className="w-5 h-5 text-white" />}
                                            title={f3Title}
                                            desc={f3Desc}
                                        />
                                    </div>

                                    {/* footer */}
                                    <p className="text-center text-[11px] text-slate-400 mt-8">
                                        &copy; {new Date().getFullYear()} {safeHighlight}. Preview only.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-10" />
                </div>
            </div>
        </AdminLayout>
    );
}

// small preview card for the right panel
function PreviewFeature({ icon, title, desc }) {
    return (
        <div className="rounded-2xl bg-white/80 border border-white/40 shadow-sm p-2 flex gap-3 items-start">
            <div className="w-5 h-5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow">
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-900">{title}</p>
                <p className="text-[10px] text-slate-500">{desc}</p>
            </div>
        </div>
    );
}
