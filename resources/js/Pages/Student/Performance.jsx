import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { formatDate, formatTime } from "@/lib/dateFormatter";
import {
    HiOutlineCalendarDays,
    HiLockClosed,
    HiCheckCircle,
} from 'react-icons/hi2';
import {
    FaCalendarAlt,
    FaUserTie,
    FaMapMarkerAlt,
    FaArrowRight,
    FaRegClock,
    FaBook,
    FaGraduationCap,
} from 'react-icons/fa';
import { MdAccessTimeFilled, MdOutlineQuiz } from 'react-icons/md';

export default function Performance() {
    let {
        evaluations = {},
        hasEvaluation = false,
        examSchedule = [],
        enrolledCourses = [],
    } = usePage().props;

    const { result } = usePage().props.flash;

    examSchedule = Array.isArray(examSchedule)
        ? examSchedule
        : Object.values(examSchedule || {});

    const now = new Date();

    const courseTypes = [
        ...new Set(
            [...Object.keys(evaluations), ...enrolledCourses]
                .map(type => type.toLowerCase())
        ),
    ];

    const renderResultCard = (result) => {
        if (!result) return null;

        const isPassed = result.status === 'PASSED';

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {isPassed ? 'Passed' : 'Failed'}
                                </span>
                                <span className="ml-3 text-sm font-medium text-gray-500">
                                    EXAM RESULT
                                </span>
                            </div>
                            <h2 className="mt-2 text-xl font-semibold text-gray-900">
                                Your Score: {result.score} / {result.total}
                            </h2>
                            <p className="text-sm text-gray-600">Percentage: {result.percentage}%</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };



    /**
     * --- RENDER EXAM CARD ---
     */
    const renderExamCard = (examSchedule, evaluation) => {
        if (!examSchedule.length && evaluation) {
            return (
                <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                        <HiOutlineCalendarDays className="w-full h-full opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No sessions scheduled</h3>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        You don’t have any driving lessons scheduled yet.
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {examSchedule.map((item, index) => {
                    const scheduleDateTime = new Date(item.datetime);
                    const isAvailable = item.exam_status === 'in_progress' || item.exam_status === 'completed' || item.exam_status === 'force_started';

                    return (
                        <div
                            key={index}
                            className="group relative p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 mb-6 overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>

                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                                        <FaGraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors duration-300">
                                            {item.course}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <MdOutlineQuiz className="w-4 h-4 mr-1 text-blue-500" />
                                                Exam Session
                                            </span>
                                            <span className="flex items-center">
                                                <FaRegClock className="w-4 h-4 mr-1 text-green-500" />
                                                {item.duration || '60 mins'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`mt-4 lg:mt-0 px-4 py-2 rounded-full border ${isAvailable
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : 'bg-amber-50 border-amber-200 text-amber-700'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        {isAvailable ? (
                                            <>
                                                <HiCheckCircle className="w-4 h-4" />
                                                <span className="text-sm font-semibold">Ready to Start</span>
                                            </>
                                        ) : (
                                            <>
                                                <HiLockClosed className="w-4 h-4" />
                                                <span className="text-sm font-semibold">Starts Soon</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <InfoBlock icon={<FaCalendarAlt />} label="Date" value={formatDate(item.datetime)} color="blue" />
                                <InfoBlock icon={<MdAccessTimeFilled />} label="Time" value={formatTime(item.datetime)} color="purple" />
                                <InfoBlock icon={<FaUserTie />} label="Instructor" value={item.instructor} color="green" />
                                <InfoBlock icon={<FaMapMarkerAlt />} label="Location" value={item.location} color="orange" />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4 sm:mb-0">
                                    <FaBook className="w-4 h-4 text-gray-400" />
                                    <span>Make sure you're prepared before starting</span>
                                </div>

                                {isAvailable ? (
                                    <Link
                                        href={route('exam.show', item.id)}
                                        className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                                    >
                                        <span>Begin Exam</span>
                                        <FaArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed"
                                    >
                                        <HiLockClosed className="w-4 h-4 mr-2" />
                                        Available {item.availableFrom ? `from ${formatDate(item.availableFrom)}` : 'Soon'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const InfoBlock = ({ icon, label, value, color }) => (
        <div className="flex items-center space-x-3">
            <div
                className={`flex-shrink-0 w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}
            >
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
            </div>
        </div>
    );

    /**
     * --- RENDER EVALUATION CARD ---
     */
    const renderEvaluationCard = (evaluation, courseType) => {
        const isPassed = evaluation?.remark?.toLowerCase() === 'passed';

        return (
            <div key={courseType} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {isPassed ? 'Passed' : 'Failed'}
                                </span>
                                <span className="ml-3 text-sm font-medium text-gray-500">
                                    {courseType.toUpperCase()} COURSE
                                </span>
                            </div>
                            <h2 className="mt-2 text-xl font-semibold text-gray-900">
                                {isPassed
                                    ? `Congratulations on completing the ${courseType} course!`
                                    : `${courseType} course not completed`}
                            </h2>
                        </div>
                    </div>

                    <div className="mt-6 space-y-6">
                        {isPassed ? (
                            <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-start">
                                    <HiCheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <p className="ml-3 text-sm text-green-700">
                                        <span className="font-medium">Certificate available!</span> You can download your certificate.
                                    </p>
                                </div>
                                <a
                                    href={`/certificate/download?courseType=${courseType}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                                >
                                    View Certificate
                                </a>
                            </div>
                        ) : (
                            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex">
                                    <HiLockClosed className="h-5 w-5 text-red-500" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Remarks</h3>
                                        <p className="mt-1 text-sm text-red-700">{evaluation?.remark || 'Failed'}</p>
                                    </div>
                                </div>
                                <Link
                                    href={route('learning.materials')}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                >
                                    View Learning Materials
                                </Link>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Instructor Notes</h3>
                            <p className="text-gray-600 text-sm">
                                {evaluation?.instructor_notes || 'No additional notes were provided.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /**
     * --- PAGE LAYOUT ---
     */
    return (
        <AuthenticatedLayout>
            <Head title="Performance" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-10">
                    {courseTypes.map((courseType) => {
                        const normalizedType = courseType.toLowerCase();
                        const courseEvaluations = evaluations[normalizedType] || [];
                        const evaluation = courseEvaluations[0] || null;

                        return (
                            <div key={courseType}>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    {courseType.charAt(0).toUpperCase() + courseType.slice(1).toLowerCase()} Performance
                                </h2>

                                {result && renderResultCard(result)}

                                {courseType === 'theoretical' && !evaluation && renderExamCard(
                                    examSchedule.filter((item) => item.course.toLowerCase() === courseType)
                                )}

                                {evaluation && renderEvaluationCard(evaluation, courseType)}


                                {courseType?.toLowerCase() === 'practical' && !evaluation && (
                                    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
                                        Your instructor will evaluate your performance soon.
                                    </div>
                                )}


                            </div>
                        );
                    })}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
