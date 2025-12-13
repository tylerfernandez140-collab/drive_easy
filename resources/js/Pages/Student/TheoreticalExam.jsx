import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { useState } from "react";
import { HiMiniArrowLeft } from "react-icons/hi2";

export default function TheoreticalExam({ student, questions, error, course_registration_id }) {
    const { result } = usePage().props.flash;
    const [answers, setAnswers] = useState({});

    const handleAnswerChange = (questionId, choice) => {
        setAnswers((prev) => ({ ...prev, [questionId]: choice }));
    };

    const handleSubmit = () => {
        router.post(route("exam.store"), {
            course_registration_id,
            answers,
        });

    };

    return (
        <AuthenticatedLayout>
            <Head title="Theoretical Exam" />
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 pt-6">
                    <Link
                        href={route('student.performance')}
                        className="rounded-lg text-sm font-medium flex items-center gap-2 w-fit bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md py-2 px-4 hover:-translate-y-0.5"
                    >
                        <HiMiniArrowLeft size={14} />
                        Back to Performance
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                                Theoretical Examination
                            </h1>
                            <p className="text-slate-600 mt-2">
                                Welcome back, <span className="font-semibold text-slate-800">{student?.name}</span>
                                <span className="text-slate-500 mx-2">•</span>
                                Student ID: <span className="font-mono text-slate-800">{student?.id}</span>
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <div className="inline-flex items-center px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                                <span className="text-sm font-medium text-slate-700">Exam in progress</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-0.5">
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {result ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-4">
                                        {result.result.status === "PASSED" ? (
                                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Exam Results</h2>
                                    <p className="text-slate-600">Your theoretical exam has been evaluated</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <div className="bg-slate-50 rounded-xl p-5 text-center">
                                        <p className="text-sm font-medium text-slate-500 mb-1">Score</p>
                                        <p className="text-3xl font-bold text-slate-800">
                                            {result.result.score}
                                            <span className="text-lg font-normal text-slate-500">/{result.result.total}</span>
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-5 text-center">
                                        <p className="text-sm font-medium text-slate-500 mb-1">Percentage</p>
                                        <p className="text-3xl font-bold text-slate-800">{result.result.percentage}%</p>
                                    </div>
                                    <div className={`rounded-xl p-5 text-center ${result.result.status === "PASSED" ? "bg-emerald-50" : "bg-red-50"}`}>
                                        <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${result.result.status === "PASSED" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                            <div className={`w-2 h-2 rounded-full mr-2 ${result.result.status === "PASSED" ? "bg-emerald-500" : "bg-red-500"}`}></div>
                                            {result.result.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <div className="flex justify-between text-sm text-slate-500 mb-2">
                                        <span>Performance</span>
                                        <span>{result.result.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-700 ${result.result.status === "PASSED"
                                                ? "bg-gradient-to-r from-emerald-500 to-green-500"
                                                : "bg-gradient-to-r from-red-500 to-orange-500"}`}
                                            style={{ width: `${result.result.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className={`rounded-xl p-5 ${result.result.status === "PASSED" ? "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100" : "bg-gradient-to-r from-red-50 to-orange-50 border border-red-100"}`}>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 mr-4">
                                            {result.result.status === "PASSED" ? (
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${result.result.status === "PASSED" ? "text-emerald-800" : "text-red-800"}`}>
                                                {result.result.status === "PASSED" ? "Congratulations!" : "Keep practicing!"}
                                            </h3>
                                            <p className={`mt-1 text-sm ${result.result.status === "PASSED" ? "text-emerald-700" : "text-red-700"}`}>
                                                {result.result.status === "PASSED"
                                                    ? "You've successfully passed the theoretical examination."
                                                    : "Review the material and try again. You'll get it next time!"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <h2 className="text-xl font-bold text-slate-800">Exam Questions</h2>
                                <div className="mt-2 md:mt-0">
                                    <span className="text-sm text-slate-600">
                                        {Object.keys(answers).length} of {questions.length} answered
                                    </span>
                                    <div className="w-32 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                            style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            {questions.map((q, index) => (
                                <div key={q.id} className="p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors duration-200 bg-white shadow-sm">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-0.5">
                                            <span className="text-sm font-semibold text-blue-700">{index + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-slate-800 mb-4">{q.question}</h3>

                                            <div className="space-y-3">
                                                {Object.entries(q.choices).map(([letter, choice]) => (
                                                    <label
                                                        key={letter}
                                                        className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-200 ${answers[q.id] === letter
                                                            ? "bg-blue-50 border-blue-300"
                                                            : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${q.id}`}
                                                            value={letter}
                                                            checked={answers[q.id] === letter}
                                                            onChange={() => handleAnswerChange(q.id, letter)}
                                                            className="mt-1 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-3 text-slate-700">
                                                            {letter}: {choice}
                                                        </span>
                                                    </label>
                                                ))}


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-slate-200 bg-slate-50">
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={Object.keys(answers).length !== questions.length}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${Object.keys(answers).length === questions.length
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                        }`}
                                >
                                    Submit Exam
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
