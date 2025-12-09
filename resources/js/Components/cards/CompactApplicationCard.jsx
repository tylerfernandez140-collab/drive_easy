
import { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import {
    FaCheckCircle,
    FaTimes,
    FaClock,
    FaTimesCircle,
    FaChevronDown,
    FaChevronUp,
    FaUser,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import ThumbnailImage from "@/Components/assets/ThumbnailImage";
import { formatDate } from "@/lib/dateFormatter";

export default function CompactApplicationCard({ app }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({ status: '', admin_remarks: '', _method: 'PUT', });

    const handleSubmit = (e, status) => {
        e.preventDefault();
        if (processing) return;
        router.put(route("admin.applicants.update", { applicant: app.id }), {
            status: status,
            admin_remarks: data.admin_remarks ?? "",
        }, {
            preserveScroll: true,
            onStart: () => {
                setIsSubmitting(true);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
            onSuccess: () => {
                reset();
                setIsExpanded(false);
                if (status === "approved") {
                    toast.success("Application approved successfully!");
                } else if (status === "rejected") {
                    toast.error("Application rejected successfully!");
                }
            },
        });
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg shadow-xs hover:shadow-sm transition-all">
            <div
                className="p-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <FaUser className="text-sm" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-800">
                                {app.user?.first_name || 'N/A'}
                                {app.user?.middle_name ? ` ${app.user.middle_name}` : ''}
                                {app.user?.last_name ? ` ${app.user.last_name}` : ''}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {formatDate(app.created_at)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border shadow-sm
                            ${app.status === 'approved'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : app.status === 'rejected'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }
                        `}>
                            {app.status === 'approved' && <FaCheckCircle className="text-green-600 text-xs" />}
                            {app.status === 'rejected' && <FaTimesCircle className="text-red-600 text-xs" />}
                            {!app.status || app.status === 'pending' ? <FaClock className="text-yellow-600 text-xs" /> : null}
                            {app.status?.charAt(0).toUpperCase() + app.status.slice(1) || 'Pending'}
                        </span>


                        {isExpanded ? (
                            <FaChevronUp className="text-gray-400 text-xs" />
                        ) : (
                            <FaChevronDown className="text-gray-400 text-xs" />
                        )}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-100 p-4 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div className="flex items-start gap-2">
                            <FaPhone className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="text-gray-800 font-medium">{app.user?.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <FaMapMarkerAlt className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-gray-500">Address</p>
                                <p className="text-gray-800 font-medium">{app.user?.address || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <FaCalendarAlt className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-gray-500">Submitted</p>
                                <p className="text-gray-800 font-medium">{new Date(app.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <svg className="text-gray-400 mt-0.5 flex-shrink-0 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <div>
                                <p className="text-gray-500">Documents</p>
                                <p className="text-gray-800 font-medium">{app.marriage_contract ? '4' : '3'} uploaded</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">DOCUMENT PREVIEW</h4>
                        <div className="flex flex-wrap gap-3">
                            <ThumbnailImage label="Birth Cert" src={`/storage/${app.birth_certificate}`} />
                            <ThumbnailImage label="Gov ID" src={`/storage/${app.gov_id}`} />
                            <ThumbnailImage label="ID Photo" src={`/storage/${app.id_picture}`} isCircle />
                            {app.marriage_contract && (
                                <ThumbnailImage label="Marriage Cert" src={`/storage/${app.marriage_contract}`} />
                            )}
                        </div>
                    </div>
                    {app.status === 'pending' && (
                        <>
                            <div className="pt-2">
                                <label className="block text-xs font-medium text-gray-700 mb-2">ADMIN REMARKS</label>
                                <textarea
                                    className="w-full text-xs border border-gray-200 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                                    rows="2"
                                    placeholder="Add notes or comments (max 500 words)..."
                                    value={data.admin_remarks}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
                                        if (wordCount <= 500) {
                                            setData('admin_remarks', value);
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, "approved")}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-green-100 text-green-700 border border-green-200 shadow-sm hover:bg-green-200 transition"
                                >
                                    Approve
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, 'rejected')}
                                    disabled={processing}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-red-100 text-red-700 border border-red-200 shadow-sm hover:bg-red-200 transition"
                                >
                                    <FaTimesCircle className="text-xs" />
                                    Reject
                                </button>
                            </div>

                        </>
                    )}
                </div>
            )}
        </div>
    );
}

