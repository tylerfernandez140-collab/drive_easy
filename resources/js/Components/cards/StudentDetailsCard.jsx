import { useState } from "react";
import {
    HiOutlineChevronRight,
    HiOutlineX,
    HiCheckCircle,
    HiXCircle,
    HiStar,
    HiOutlineClock
} from "react-icons/hi";

export default function StudentDetailsCard({ student, courseRegistration, courseType }) {
    const [open, setOpen] = useState(false);

    const evaluation = courseRegistration?.evaluations?.[0] ?? null;

    let status;
    if (!evaluation?.remark) {
        status = "pending";
    } else if (evaluation.remark.toLowerCase() === "passed") {
        status = "passed";
    } else {
        status = "failed";
    }

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="group flex items-center space-x-1 cursor-pointer text-indigo-600 hover:text-indigo-700 transition-colors"
            >
                <span className="text-sm font-medium">View Details</span>
                <HiOutlineChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-[fadeInScale_0.25s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {student?.name || "Student Name"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Evaluation Overview
                                </p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <HiOutlineX className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4 text-sm text-gray-700">
                            <div className="flex justify-between items-center border-b pb-3">
                                <span className="font-medium">Course Type</span>
                                <span className="font-semibold bg-gray-100 text-gray-800 px-3 py-1 rounded-lg">
                                    {courseType ?? "N/A"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-b pb-3">
                                <span className="font-medium flex items-center gap-2">
                                    <HiStar className="h-5 w-5 text-yellow-500" />
                                    Total Score
                                </span>
                                <span className="font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg">
                                    {evaluation?.total_score ?? "N/A"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-b pb-3">
                                <span className="font-medium">Remark</span>
                                <span
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                                        ${status === "passed"
                                            ? "bg-green-100 text-green-700"
                                            : status === "failed"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {status === "passed" ? (
                                        <>
                                            <HiCheckCircle className="h-4 w-4" />
                                            Passed
                                        </>
                                    ) : status === "failed" ? (
                                        <>
                                            <HiXCircle className="h-4 w-4" />
                                            Failed
                                        </>
                                    ) : (
                                        <>
                                            <HiOutlineClock className="h-4 w-4" />
                                            Pending
                                        </>
                                    )}
                                </span>
                            </div>

                            <div>
                                <span className="font-medium">Instructor Notes</span>
                                <p className="mt-2 text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">
                                    {evaluation?.instructor_notes ?? "No notes available"}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium shadow-sm 
                                    hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 
                                    focus:ring-indigo-500 focus:ring-offset-1 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
