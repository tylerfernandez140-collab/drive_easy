import InstructorLayout from '@/Layouts/InstructorLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaChalkboardTeacher, FaCalendarAlt, FaCheckCircle, FaFileAlt } from 'react-icons/fa';
import Modal from '@/Components/ui/Modal';

export default function Dashboard({ ongoingTrainings, upcomingSessions, evaluatedStudents, feedbackReports }) {
    const [greeting, setGreeting] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ type: '', items: [] });

    const openModal = (type, data) => {
        let items = [];
        let title = '';

        switch (type) {
            case 'ongoingTrainings':
                title = 'Ongoing Trainings';
                items = data.map(item => ({
                    id: item.id,
                    name: item.student_application.user,
                    date: new Date(item.schedule.date).toLocaleDateString(),
                    status: item.status,
                }));
                break;
            case 'upcomingSessions':
                title = 'Upcoming Sessions';
                items = data.map(item => ({
                    id: item.id,
                    name: item.student_application.user,
                    date: new Date(item.schedule.date).toLocaleDateString(),
                    status: item.status,
                }));
                break;
            case 'evaluatedStudents':
                title = 'Evaluated Students';
                items = data.map(item => ({
                    id: item.id,
                    name: item.student_application.user,
                    course: item.course_registration.course_type,
                    evaluation_date: new Date(item.created_at).toLocaleDateString(),
                }));
                break;
            case 'feedbackReports':
                title = 'Feedback Reports';
                items = data.map(item => ({
                    id: item.id,
                    name: item.student_application.user,
                    date: new Date(item.created_at).toLocaleDateString(),
                    summary: item.remark,
                }));
                break;
            default:
                break;
        }

        setModalData({ type, title, items });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalData({ type: '', items: [] });
    };

    useEffect(() => {
        const now = new Date();
        const hours = now.getHours();
        const day = now.toLocaleDateString(undefined, { weekday: 'long' });

        let timeGreeting = 'Welcome';
        if (hours < 12) {
            timeGreeting = 'Good morning';
        } else if (hours < 18) {
            timeGreeting = 'Good afternoon';
        }

        setGreeting(`${timeGreeting}, Instructor. Happy ${day}!`);
    }, []);

    return (
        <InstructorLayout>
            <Head title="Instructor Dashboard" />
            <div className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">{greeting}</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                             onClick={() => openModal('ongoingTrainings', ongoingTrainings)}>
                            <div className="flex items-center space-x-4">
                                <FaChalkboardTeacher className="text-indigo-600 text-2xl" />
                                <div>
                                    <p className="text-gray-600 text-sm">Ongoing Trainings</p>
                                    <p className="text-xl font-semibold text-gray-900">{ongoingTrainings.length ?? 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                             onClick={() => openModal('upcomingSessions', upcomingSessions)}>
                            <div className="flex items-center space-x-4">
                                <FaCalendarAlt className="text-teal-600 text-2xl" />
                                <div>
                                    <p className="text-gray-600 text-sm">Upcoming Sessions</p>
                                    <p className="text-xl font-semibold text-gray-900">{upcomingSessions.length ?? 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                             onClick={() => openModal('evaluatedStudents', evaluatedStudents)}>
                            <div className="flex items-center space-x-4">
                                <FaCheckCircle className="text-green-600 text-2xl" />
                                <div>
                                    <p className="text-gray-600 text-sm">Evaluated Students</p>
                                    <p className="text-xl font-semibold text-gray-900">{evaluatedStudents.length ?? 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                             onClick={() => openModal('feedbackReports', feedbackReports)}>
                            <div className="flex items-center space-x-4">
                                <FaFileAlt className="text-yellow-500 text-2xl" />
                                <div>
                                    <p className="text-gray-600 text-sm">Feedback Reports</p>
                                    <p className="text-xl font-semibold text-gray-900">{feedbackReports.length ?? 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">📚 Instructor Overview</h2>
                        <p className="text-gray-700 text-base leading-relaxed mb-6">
                            As an instructor, you have the tools to mentor students, schedule trainings, and ensure success through practical evaluation.
                        </p>
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="text-indigo-600 mt-1">✔</span>
                                <span>Manage your scheduled training sessions.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-indigo-600 mt-1">✔</span>
                                <span>Mark attendance and monitor student participation.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-indigo-600 mt-1">✔</span>
                                <span>Evaluate students based on practical driving performance.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-indigo-600 mt-1">✔</span>
                                <span>Submit reports and feedback directly to the admin dashboard.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-indigo-600 mt-1">✔</span>
                                <span>Upload reference materials or useful driving resources for students.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} title={modalData.title} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">{modalData.title}</h2>
                    <div className="mt-2 text-sm text-gray-600">
                        {modalData.items.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2">
                                {modalData.items.map(item => (
                                    <li key={item.id} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-2">
                                        {modalData.type === 'ongoingTrainings' || modalData.type === 'upcomingSessions' ? (
                                            <p className="text-gray-800 font-semibold">Student: {item.name.first_name} {item.name.last_name} - Date: {item.date} - Status: {item.status}</p>
                                        ) : modalData.type === 'evaluatedStudents' ? (
                                            <p className="text-gray-800 font-semibold">Student: {item.name.first_name} {item.name.last_name} - Course: {item.course} - Evaluation Date: {item.evaluation_date}</p>
                                        ) : modalData.type === 'feedbackReports' ? (
                                            <p className="text-gray-800 font-semibold">Student: {item.name.first_name} {item.name.last_name} - Date: {item.date} - Summary: {item.summary}</p>
                                        ) : null}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No data available.</p>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={closeModal}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </InstructorLayout>
    );
}
