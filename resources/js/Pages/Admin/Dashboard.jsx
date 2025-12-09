import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaUserCheck, FaClock, FaClipboardList, FaCertificate, FaFileAlt, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import Modal from '@/Components/ui/Modal';
import axios from 'axios';

export default function Dashboard({ pendingApplications, upcomingSchedules, verifiedStudents, certificatesIssued }) {
    const [greeting, setGreeting] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState([]);

    useEffect(() => {
        const now = new Date();
        const hours = now.getHours();
        const day = now.toLocaleDateString(undefined, { weekday: 'long' });

        let timeGreeting = 'Welcome';
        if (hours < 12) {
            timeGreeting = 'Good morning';
        } else if (hours < 18) {
            timeGreeting = 'Good afternoon';
        } else {
            timeGreeting = 'Good evening';
        }

        setGreeting(`${timeGreeting}, Admin. Happy ${day}!`);
    }, []);

    const fetchDataAndShowModal = async (type) => {
        let url = '';
        let title = '';
        switch (type) {
            case 'pendingApplications':
                url = route('admin.dashboard.pendingApplicationsData');
                title = 'Pending Applications';
                break;
            case 'upcomingSchedules':
                url = route('admin.dashboard.upcomingSchedulesData');
                title = 'Upcoming Schedules';
                break;
            case 'verifiedStudents':
                url = route('admin.dashboard.verifiedStudentsData');
                title = 'Verified Students';
                break;
            case 'certificatesIssued':
                url = route('admin.dashboard.certificatesIssuedData');
                title = 'Certificates Issued';
                break;
            default:
                return;
        }

        try {
            const response = await axios.get(url);
            setModalTitle(title);
            setModalContent(response.data);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle error (e.g., show an alert to the user)
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">{greeting}</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <OverviewCards
                            icon={<FaClipboardList className="text-indigo-600 text-2xl" />}
                            title="Pending Applications"
                            value={pendingApplications.length}
                            onClick={() => fetchDataAndShowModal('pendingApplications')}
                        />
                        <OverviewCards
                            icon={<FaClock className="text-teal-600 text-2xl" />}
                            title="Upcoming Schedules"
                            value={upcomingSchedules.length}
                            onClick={() => fetchDataAndShowModal('upcomingSchedules')}
                        />
                        <OverviewCards
                            icon={<FaUserCheck className="text-green-600 text-2xl" />}
                            title="Verified Students"
                            value={verifiedStudents.length}
                            onClick={() => fetchDataAndShowModal('verifiedStudents')}
                        />
                        <OverviewCards
                            icon={<FaCertificate className="text-yellow-500 text-2xl" />}
                            title="Certificates Issued"
                            value={certificatesIssued.length}
                            onClick={() => fetchDataAndShowModal('certificatesIssued')}
                        />
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">📊 System Overview</h2>
                        <p className="text-gray-700 text-base leading-relaxed mb-6">
                            Manage and monitor every aspect of your driving school seamlessly through this comprehensive dashboard.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SystemFeature
                                icon={<FaUsers className="text-blue-600" />}
                                title="Student Management"
                                description="Review applications, verify requirements, and manage student records with progress tracking."
                            />
                            <SystemFeature
                                icon={<FaCalendarAlt className="text-green-600" />}
                                title="Schedule Management"
                                description="Assign training and examination schedules with automated notifications."
                            />
                            <SystemFeature
                                icon={<FaFileAlt className="text-purple-600" />}
                                title="Course Approval"
                                description="Approve registrations for theoretical and practical courses efficiently."
                            />
                            <SystemFeature
                                icon={<FaCertificate className="text-orange-600" />}
                                title="Certification"
                                description="Track and issue certificates with complete history and verification."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">{modalTitle}</h2>
                    <div className="mt-2 text-sm text-gray-600">
                        {modalContent.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2">
                                {modalContent.map((item, index) => {
                                    if (modalTitle === 'Pending Applications') {
                                        return (
                                            <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-2">
                                                <p className="text-gray-800 font-semibold">Name: {item.user ? `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim() || 'N/A' : 'N/A'}</p>
                                                <p className="text-gray-600 text-sm">Phone: {item.user?.phone || 'N/A'}</p>
                                                <p className="text-gray-600 text-sm">Address: {item.user?.address || 'N/A'}</p>
                                                <p className="text-gray-600 text-sm">Submitted Date: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</p>
                                            </li>
                                        );
                                    } else if (modalTitle === 'Verified Students') {
                                        return (
                                            <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-2">
                                                <p className="text-gray-800 font-semibold">Name: {item.user ? `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim() || 'N/A' : 'N/A'}</p>
                                                <p className="text-gray-600 text-sm">Phone: {item.user?.phone || 'N/A'}</p>
                                                <p className="text-gray-600 text-sm">Address: {item.user?.address || 'N/A'}</p>
                                                <p className="text-gray-600 text-sm">Submitted Date: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</p>
                                            </li>
                                        );
                                    } else if (modalTitle === 'Upcoming Schedules') {
                                        return (
                                            <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-2">
                                                <p className="text-gray-800 font-semibold">Date: {item.date}</p>
                                                <p className="text-gray-600 text-sm">Time: {item.time}</p>
                                                <p className="text-gray-600 text-sm">Location: {item.location}</p>
                                                <p className="text-gray-600 text-sm">Instructor: {item.instructor ? `${item.instructor.first_name || ''} ${item.instructor.last_name || ''}`.trim() || 'N/A' : 'N/A'}</p>
                                                <p className="text-gray-600 text-sm">Student: {item.course_registration && item.course_registration.student_application && item.course_registration.student_application.user ? `${item.course_registration.student_application.user.first_name || ''} ${item.course_registration.student_application.user.last_name || ''}`.trim() || 'N/A' : 'N/A'}</p>
                                                <p className="text-gray-600 text-sm">Course Type: {item.course_registration?.course_type || 'N/A'}</p>
                                                {item.course_registration?.course_type === 'Practical Course' && (
                                                    <p className="text-gray-600 text-sm">Vehicle: {item.vehicle ? `${item.vehicle.make} ${item.vehicle.model}` : 'N/A'}</p>
                                                )}
                                            </li>
                                        );
                                    } else if (modalTitle === 'Certificates Issued') {
                                        return (
                                            <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-2">
                                                <p className="text-gray-800 font-semibold">Name: {item.student_application && item.student_application.user ? `${item.student_application.user.first_name || ''} ${item.student_application.user.last_name || ''}`.trim() || 'N/A' : 'N/A'}</p>
                                                <p className="text-gray-600 text-sm">Course Type: {item.course_type}</p>
                                                <p className="text-gray-600 text-sm">Course Status: {item.course_status}</p>
                                                <p className="text-gray-600 text-sm">Issued At: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</p>
                                            </li>
                                        );
                                    }
                                    return <li key={index}>{item.user?.name || 'N/A'}</li>;
                                })}
                            </ul>
                        ) : (
                            <p>No data available.</p>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setShowModal(false)}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout >
    );
}
export function OverviewCards({ icon, title, value, onClick }) {
    return (
        <div
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer"
            onClick={onClick}
        >
            <div className="flex items-center space-x-4">
                {icon}
                <div>
                    <p className="text-gray-600 text-sm">{title}</p>
                    <p className="text-xl font-semibold text-gray-900">{value ?? 0}</p>
                </div>
            </div>
        </div>
    );
}
function SystemFeature({ icon, title, description }) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
            <div className="p-3 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
}