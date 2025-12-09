import InstructorLayout from '@/Layouts/InstructorLayout';
import { Head, Link } from '@inertiajs/react';
import { FiUser, FiCalendar, FiClock, FiMapPin, FiBook, FiGrid, FiList, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import { formatDate, formatTime } from '@/lib/dateFormatter';
import { router } from "@inertiajs/react";
import toast, { Toaster } from 'react-hot-toast';

export default function AssignedStudents({ students }) {
    const [viewMode, setViewMode] = useState('list');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const studentsByDate = students.reduce((acc, student) => {
        const date = new Date(student.date).toDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(student);
        return acc;
    }, {});

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const daysFromPrevMonth = firstDay;
        const prevMonthDays = new Date(year, month, 0).getDate();

        const totalDaysToShow = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7;
        const daysFromNextMonth = totalDaysToShow - (daysInMonth + daysFromPrevMonth);

        const days = [];

        for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonthDays - i);
            days.push({ date, isCurrentMonth: false });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push({ date, isCurrentMonth: true });
        }

        for (let i = 1; i <= daysFromNextMonth; i++) {
            const date = new Date(year, month + 1, i);
            days.push({ date, isCurrentMonth: false });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    function handleSubmit(e, scheduleId, courseType) {
        e.preventDefault();

        if (courseType?.toLowerCase() === "theoretical") {
            router.put(
                route("instructor.exam.start", { schedule: scheduleId }),
                {},
                {
                    preserveState: true,
                    onSuccess: () => toast.success("Student Assigned Successfully", { duration: 3000 }),
                }
            );
        }
    }

    return (
        <InstructorLayout>
            <Head title="My Schedule" />
            <Toaster position="top-center" reverseOrder={false} />
            <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {students.length} sessions
                                </span>
                            </div>
                            <p className="text-gray-500">
                                {viewMode === 'calendar'
                                    ? 'Calendar view of your training sessions'
                                    : 'List of all assigned students and upcoming sessions'}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="inline-flex rounded-lg shadow-sm border border-gray-200 bg-white overflow-hidden">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'list'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <FiList className="mr-2" />
                                    List View
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'calendar'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <FiGrid className="mr-2" />
                                    Calendar View
                                </button>
                            </div>


                        </div>
                    </div>

                    {students.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                            <div className="mx-auto h-24 w-24 text-gray-300 mb-4 flex items-center justify-center rounded-full bg-gray-50">
                                <FiCalendar className="w-12 h-12" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No scheduled sessions</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-4">
                                You currently don't have any training sessions scheduled.
                            </p>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <FiPlus className="mr-2" />
                                Schedule a Session
                            </button>
                        </div>
                    ) : viewMode === 'calendar' ? (
                        /* Calendar View */
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Calendar Header */}
                            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={goToToday}
                                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        Today
                                    </button>
                                    <div className="flex rounded-lg border border-gray-300 bg-white overflow-hidden">
                                        <button
                                            onClick={goToPreviousMonth}
                                            className="p-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <FiChevronLeft className="h-5 w-5 text-gray-600" />
                                        </button>
                                        <div className="border-l border-r border-gray-300">
                                            <button
                                                onClick={goToNextMonth}
                                                className="p-2 hover:bg-gray-50 transition-colors"
                                            >
                                                <FiChevronRight className="h-5 w-5 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-px bg-gray-200 border-b border-gray-200">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div key={day} className="bg-gray-50 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-px bg-gray-200">
                                {calendarDays.map((day, i) => {
                                    const dateString = day.date.toDateString();
                                    const dayStudents = studentsByDate[dateString] || [];
                                    const isToday = new Date().toDateString() === dateString;

                                    return (
                                        <div
                                            key={i}
                                            className={`bg-white min-h-32 p-2 ${!day.isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''}`}
                                        >
                                            <div className={`text-right p-1 mb-1 ${isToday
                                                ? 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white'
                                                : ''}`}>
                                                {day.date.getDate()}
                                            </div>
                                            <div className="space-y-1">
                                                {dayStudents.map((student, idx) => {
                                                    const studentData = student.course_registration?.student_application?.user;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="p-2 text-xs bg-indigo-50 rounded-lg hover:bg-indigo-100 cursor-pointer transition-colors border border-indigo-100"
                                                        >
                                                            <div className="font-medium truncate text-indigo-900">
                                                                {studentData?.first_name + ' ' + studentData?.last_name || 'Student'}
                                                            </div>
                                                            <div className="text-indigo-600 truncate flex items-center">
                                                                <FiClock className="mr-1" />
                                                                {formatDate(student.created_at)}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* List Header */}
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Sorted by date - {students.length} upcoming sessions
                                </p>
                            </div>

                            {/* Student List */}
                            <div className="divide-y divide-gray-200">
                                {students
                                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                                    .map((item, index) => {
                                        const student = item.course_registration?.student_application?.user;
                                        const courseType = item.course_registration?.course_type;
                                        const sessionDate = new Date(item.date);
                                        const isToday = new Date().toDateString() === sessionDate.toDateString();

                                        return (
                                            <div
                                                key={index}
                                                className="group py-4 px-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-4 min-w-0">
                                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mt-1 
                                                            ${isToday ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                                                            <FiUser className="h-5 w-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-base font-semibold text-gray-900 truncate">
                                                                    {student?.first_name + ' ' + student?.last_name || 'Unknown Student'}
                                                                </h3>
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                                                    ${courseType === 'Practical' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                                    {courseType}
                                                                </span>
                                                            </div>
                                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                                    {formatDate(item.created_at)}
                                                                </div>
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                                    {formatTime(item.created_at)}
                                                                </div>
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <FiMapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                                    {item.location || 'Location TBD'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        {courseType?.toLowerCase() === "theoretical" ? (
                                                            <button
                                                                onClick={(e) => handleSubmit(e, item.id, courseType)}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors rounded-lg"
                                                            >
                                                                Start Exam
                                                            </button>
                                                        ) : (
                                                            <Link
                                                                href={`/instructor/evaluateStudents/${item.course_registration.student_application.user.id}?courseType=${courseType}`}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                                                            >
                                                                Evaluate
                                                            </Link>

                                                        )}


                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </InstructorLayout>
    );
}
