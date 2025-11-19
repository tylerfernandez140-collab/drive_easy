import InstructorLayout from '@/Layouts/InstructorLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    FiCheckCircle,
    FiXCircle,
    FiSearch,
    FiFilter,
    FiUser,
    FiBook,
    FiArrowLeft,
} from 'react-icons/fi';

export default function EvaluatedStudents({ evaluations = [], success }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [courseTypeFilter, setCourseTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredEvaluations = useMemo(() => {
        return evaluations.filter((evaluation) => {
            const student = evaluation.student || evaluation.course_registration?.student_application?.user;

            const name = (student?.name || '').toLowerCase();
            const email = (student?.email || '').toLowerCase();
            const courseType = (evaluation.course_type || '').toLowerCase();
            const remark = (evaluation.remark || '').toLowerCase();

            const search = searchTerm.toLowerCase().trim();

            const matchesSearch =
                !search ||
                name.includes(search) ||
                email.includes(search);

            const matchesCourseType =
                courseTypeFilter === 'all' || courseType === courseTypeFilter.toLowerCase();

            const matchesStatus =
                statusFilter === 'all' || remark === statusFilter.toLowerCase();

            return matchesSearch && matchesCourseType && matchesStatus;
        });
    }, [evaluations, searchTerm, courseTypeFilter, statusFilter]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-PH', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <InstructorLayout>
            <Head title="Evaluated Students" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header + Tabs */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Evaluated Students
                                </h1>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    {evaluations.length} evaluations
                                </span>
                            </div>
                            <p className="text-gray-500">
                                View all students you have already evaluated along with their scores and results.
                            </p>
                        </div>

                        {/* Simple tab switch between Assigned & Evaluated */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="inline-flex rounded-lg shadow-sm border border-gray-200 bg-white overflow-hidden">
                                {/* 🔁 Update href/route() to your actual assigned-students route */}
                                <Link
                                    href="/instructor/assigned-students"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border-r border-gray-200"
                                >
                                    Assigned Students
                                </Link>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium bg-indigo-600 text-white"
                                >
                                    Evaluated Students
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Success message from evaluation */}
                    {success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                            <FiCheckCircle className="mt-0.5 flex-shrink-0" />
                            <div>{success}</div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiFilter className="text-gray-400" />
                            <span>Filter evaluations</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative flex-1">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by student name or email"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                />
                            </div>

                            {/* Course type filter */}
                            <select
                                value={courseTypeFilter}
                                onChange={(e) => setCourseTypeFilter(e.target.value)}
                                className="text-sm rounded-lg border border-gray-300 px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All course types</option>
                                <option value="theoretical">Theoretical</option>
                                <option value="practical">Practical</option>
                            </select>

                            {/* Status filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="text-sm rounded-lg border border-gray-300 px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All results</option>
                                <option value="passed">Passed only</option>
                                <option value="failed">Failed only</option>
                            </select>
                        </div>
                    </div>

                    {/* List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {filteredEvaluations.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-gray-50 text-gray-300">
                                    <FiUser className="w-8 h-8" />
                                </div>
                                <h3 className="text-base font-medium text-gray-900 mb-1">
                                    No evaluated students found
                                </h3>
                                <p className="text-sm text-gray-500 max-w-md mx-auto">
                                    Once you evaluate students, they will appear here with their scores and pass/fail status.
                                </p>
                                <div className="mt-4">
                                    {/* 🔁 Update href/route to your Assigned Students / Schedule route */}
                                    <Link
                                        href="/instructor/assigned-students"
                                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                    >
                                        <FiArrowLeft className="mr-1" />
                                        Go to Assigned Students
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 text-xs font-semibold text-gray-500 bg-gray-50 uppercase tracking-wide">
                                    <div className="col-span-2">Student</div>
                                    <div>Course Type</div>
                                    <div>Score</div>
                                    <div>Status</div>
                                    <div>Evaluated At</div>
                                </div>

                                {filteredEvaluations.map((evaluation) => {
                                    const student =
                                        evaluation.student ||
                                        evaluation.course_registration?.student_application?.user;

                                    const isPassed =
                                        (evaluation.remark || '').toUpperCase() === 'PASSED';

                                    return (
                                        <div
                                            key={evaluation.id}
                                            className="px-4 md:px-6 py-4 flex flex-col md:grid md:grid-cols-6 md:gap-4 hover:bg-gray-50 transition-colors"
                                        >
                                            {/* Student */}
                                            <div className="col-span-2 flex items-start gap-3">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                    <FiUser className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {student?.name || 'Unknown Student'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {student?.email || 'No email'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Course type */}
                                            <div className="mt-3 md:mt-0 flex items-center">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${(evaluation.course_type || '').toLowerCase() === 'practical'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                        }`}
                                                >
                                                    <FiBook className="mr-1 h-3 w-3" />
                                                    {evaluation.course_type
                                                        ? evaluation.course_type.charAt(0).toUpperCase() +
                                                        evaluation.course_type.slice(1)
                                                        : 'N/A'}
                                                </span>
                                            </div>

                                            {/* Score */}
                                            <div className="mt-3 md:mt-0 flex items-center text-sm text-gray-800">
                                                {evaluation.total_score ?? '-'} / 100
                                            </div>

                                            {/* Status */}
                                            <div className="mt-3 md:mt-0 flex items-center">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isPassed
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-rose-100 text-rose-800'
                                                        }`}
                                                >
                                                    {isPassed ? (
                                                        <FiCheckCircle className="mr-1.5 h-4 w-4" />
                                                    ) : (
                                                        <FiXCircle className="mr-1.5 h-4 w-4" />
                                                    )}
                                                    {evaluation.remark || (isPassed ? 'PASSED' : 'FAILED')}
                                                </span>
                                            </div>

                                            {/* Evaluated at */}
                                            <div className="mt-3 md:mt-0 flex flex-col justify-center text-xs text-gray-500">
                                                <span>{formatDate(evaluation.created_at)}</span>
                                                <span>{formatTime(evaluation.created_at)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </InstructorLayout>
    );
}
