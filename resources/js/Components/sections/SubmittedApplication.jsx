// SubmittedApplication.jsx
import { FaUser, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

function ImageDisplay({ label, src, isCircle = false }) {
    return (
        <div>
            <p className="font-medium text-gray-700 mb-1">{label}:</p>
            <img
                src={src}
                alt={label}
                className={`${isCircle ? "w-24 h-24 rounded-full" : "w-40 h-auto rounded-md"} 
                            border shadow-sm object-cover`}
            />
        </div>
    );
}

export default function SubmittedApplication({ applications }) {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <section className="space-y-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Submitted Application
                </h1>

                {applications.length > 0 ? (
                    <div className="space-y-6">
                        {applications.map((app) => (
                            <div
                                key={app.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                                {/* Header Section */}
                                <div className="p-6">
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <FaUser className="text-sm" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {`${app.user?.first_name || ""} ${app.user?.middle_name || ""} ${app.user?.last_name || ""}`.trim() || "N/A"}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 flex items-center mt-1">
                                            <svg
                                                className="w-4 h-4 mr-1.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            Submitted{" "}
                                            {new Date(app.created_at).toLocaleDateString(
                                                "en-US",
                                                { month: "short", day: "numeric", year: "numeric" }
                                            )}
                                        </p>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="font-medium text-gray-500 mb-1">Contact</p>
                                            <p className="text-gray-900 font-semibold">
                                                {app.user?.phone || "N/A"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="font-medium text-gray-500 mb-1">Address</p>
                                            <p className="text-gray-900 font-semibold">
                                                {app.user?.address || "N/A"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="font-medium text-gray-500 mb-1">Status</p>
                                            <span
                                                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border shadow-sm
                                                    ${app.status === "approved"
                                                        ? "bg-green-100 text-green-700 border-green-200"
                                                        : app.status === "rejected"
                                                            ? "bg-red-100 text-red-700 border-red-200"
                                                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                    }
                                                `}
                                            >
                                                {app.status === "approved" && (
                                                    <FaCheckCircle className="text-green-600 text-xs" />
                                                )}
                                                {app.status === "rejected" && (
                                                    <FaTimesCircle className="text-red-600 text-xs" />
                                                )}
                                                {!app.status || app.status === "pending" ? (
                                                    <FaClock className="text-yellow-600 text-xs" />
                                                ) : null}
                                                {app.status?.charAt(0).toUpperCase() +
                                                    app.status.slice(1) || "Pending"}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="font-medium text-gray-500 mb-1">Account ID</p>
                                            <p className="text-gray-900 font-mono font-semibold">
                                                #{app.user?.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Documents Section */}
                                <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                        Attached Documents
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <ImageDisplay
                                            label="Birth Certificate"
                                            src={`/storage/${app.birth_certificate}`}
                                            className="hover:ring-2 hover:ring-blue-200 transition-all"
                                        />
                                        <ImageDisplay
                                            label="Government ID"
                                            src={`/storage/${app.gov_id}`}
                                            className="hover:ring-2 hover:ring-blue-200 transition-all"
                                        />
                                        <ImageDisplay
                                            label="ID Picture"
                                            src={`/storage/${app.id_picture}`}
                                            isCircle
                                            className="hover:ring-2 hover:ring-blue-200 transition-all"
                                        />
                                        {app.marriage_contract && (
                                            <ImageDisplay
                                                label="Marriage Contract"
                                                src={`/storage/${app.marriage_contract}`}
                                                className="hover:ring-2 hover:ring-blue-200 transition-all"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 
                                5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-700">
                            No applications submitted
                        </h3>
                    </div>
                )}
            </section>
        </div>
    );
}
