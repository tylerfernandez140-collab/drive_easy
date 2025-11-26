import React, { useState } from "react";

import {
    HiOutlineCalendarDays,
    HiOutlineClock,
    HiOutlineUser,
    HiOutlineMapPin,
    HiOutlineBookOpen,
    HiOutlinePlusCircle,
    HiOutlineChevronDown,
    HiOutlineUserGroup,
    HiOutlineCog,
} from "react-icons/hi2";
import StudentDetailsCard from "../cards/StudentDetailsCard";
import { formatDate } from "@/lib/dateFormatter";

export default function ExistingSchedules({
    schedules,
    groupedTheoretical,
    groupedPractical,
    selectedSchedule,
    setSelectedSchedule,
    selectedStudent,
    setSelectedStudent,
}) {
    const [visibleCount, setVisibleCount] = useState(4);
    const [counter, setCounter] = useState(25); // you can later make this dynamic if needed

    const handleScheduleClick = (groupWithKind) => {
        setSelectedSchedule(groupWithKind);
        setSelectedStudent(null);
    };

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };

    // Helper: badge color for a given count and capacity
    const getCapacityBadgeClass = (count, capacity) => {
        const ratio = count / capacity;

        if (count >= capacity) {
            return "bg-red-100 text-red-800";
        }

        if (ratio >= 0.8) {
            return "bg-orange-100 text-orange-800";
        }

        return "bg-green-100 text-green-800";
    };

    // capacity for the selected schedule (detail view)
    const maxSlotsForSelected =
        selectedSchedule?.kind === "practical" ? 4 : 25;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                    Existing Schedules
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {schedules.length} scheduled training sessions
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-y-0 divide-gray-100">
                    {/* THEORETICAL */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <HiOutlineBookOpen className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Theoretical Sessions
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Classroom-based training schedules
                                </p>
                            </div>
                            <span className="ml-auto px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                                {groupedTheoretical.length} sessions
                            </span>
                        </div>

                        <div className="space-y-3">
                            {groupedTheoretical.slice(0, visibleCount).map((group, index) => {
                                const count = group.students.length;
                                const capacity = 25;

                                return (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            handleScheduleClick({
                                                ...group,
                                                kind: "theoretical",
                                            })
                                        }
                                        className="group p-2 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <HiOutlineCalendarDays className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">
                                                    {formatDate(group.date)}
                                                </span>
                                            </div>
                                            <div
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCapacityBadgeClass(
                                                    count,
                                                    capacity
                                                )}`}
                                            >
                                                {count}/{capacity}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <HiOutlineUserGroup className="h-4 w-4" />
                                                {count} students
                                            </span>
                                            <span className="gap-1 text-indigo-600 group-hover:text-indigo-700 transition-colors">
                                                <HiOutlineChevronDown className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {visibleCount < groupedTheoretical.length && (
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setVisibleCount((prev) => prev + 10)}
                                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <HiOutlinePlusCircle className="h-4 w-4" />
                                    Load more sessions (
                                    {groupedTheoretical.length - visibleCount} remaining)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* PRACTICAL */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <HiOutlineCog className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Practical Sessions
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Hands-on training schedules
                                </p>
                            </div>
                            <span className="ml-auto px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                {groupedPractical.length} sessions
                            </span>
                        </div>

                        <div className="space-y-3">
                            {groupedPractical.slice(0, visibleCount).map((group, index) => {
                                const count = group.students.length;
                                const capacity = 4;

                                return (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            handleScheduleClick({
                                                ...group,
                                                kind: "practical",
                                            })
                                        }
                                        className="group p-2 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <HiOutlineCalendarDays className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">
                                                    {formatDate(group.date)}
                                                </span>
                                            </div>
                                            <div
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCapacityBadgeClass(
                                                    count,
                                                    capacity
                                                )}`}
                                            >
                                                {count}/{capacity}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <HiOutlineUserGroup className="h-4 w-4" />
                                                {count} students
                                            </span>
                                            <HiOutlineChevronDown className="h-3 w-3" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {visibleCount < groupedPractical.length && (
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setVisibleCount((prev) => prev + 10)}
                                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <HiOutlinePlusCircle className="h-4 w-4" />
                                    Load more sessions (
                                    {groupedPractical.length - visibleCount} remaining)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DETAIL VIEW FOR SELECTED DAY */}
            {selectedSchedule && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <HiOutlineCalendarDays className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Schedule for
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {selectedSchedule.date}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                                    {selectedSchedule.schedules.length} sessions
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {selectedSchedule.schedules.slice(0, counter).map((sched, idx) => (
                                <div
                                    key={idx}
                                    className="group relative bg-white border border-gray-200 rounded-lg shadow-xs hover:shadow-md transition-all duration-200 hover:border-indigo-100"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100 bg-white rounded-t-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors 
                                                ${sched.course_registration?.course_status === "not_started"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : sched.course_registration?.course_status === "completed"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {sched.course_registration?.course_status ===
                                                    "not_started" && "Not Started"}
                                                {sched.course_registration?.course_status ===
                                                    "completed" && "Completed"}
                                                {sched.course_registration?.course_status !==
                                                    "not_started" &&
                                                    sched.course_registration?.course_status !==
                                                    "completed" &&
                                                    (sched.course_registration?.course_status ??
                                                        "In Progress")}
                                            </span>

                                            <span className="text-xs text-gray-500">
                                                {(sched.students?.length || 0)}/{maxSlotsForSelected} students
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                                            {sched.course_registration?.course_type}
                                        </h4>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-2 flex-1">
                                                <HiOutlineClock className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium">
                                                    {sched.time}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-1">
                                                <HiOutlineMapPin className="h-4 w-4 text-gray-400" />
                                                <span className="truncate">
                                                    {sched.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full">
                                                <HiOutlineUser className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500">Instructor</p>
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {sched.instructor?.name || "TBA"}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            {!sched.students || sched.students.length === 0 ? (
                                                <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                                                    <HiOutlinePlusCircle className="h-6 w-6 text-gray-300 mx-auto mb-1" />
                                                    <p className="text-xs text-gray-500">
                                                        No students registered
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {sched.students.map((student, idx2) => (
                                                        <li
                                                            key={idx2}
                                                            onClick={() =>
                                                                handleStudentClick(student)
                                                            }
                                                            className="group flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                                        >
                                                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                                <div className="flex items-center justify-center w-6 h-6 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                                                                    {student.name
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("")}
                                                                </div>
                                                                <span className="text-sm text-gray-700 font-medium truncate flex-1">
                                                                    {student.name}
                                                                </span>
                                                            </div>
                                                            <StudentDetailsCard
                                                                student={student}
                                                                courseRegistration={sched.course_registration}
                                                                courseType={
                                                                    sched.course_registration
                                                                        ?.evaluations?.[0]?.course_type
                                                                }
                                                            />
                                                        </li>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
