import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import CreateInstructorModal from '@/Components/CreateInstructorModal';
import PrimaryButton from '@/Components/ui/Button/PrimaryButton';

export default function UserManagement({ auth, instructors }) {
    const [showingCreateInstructorModal, setShowingCreateInstructorModal] = useState(false);

    const openCreateInstructorModal = () => {
        setShowingCreateInstructorModal(true);
    };

    const closeCreateInstructorModal = () => {
        setShowingCreateInstructorModal(false);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User Management</h2>}
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Instructors</h3>
                                <PrimaryButton onClick={openCreateInstructorModal}>
                                    Create Instructor Account
                                </PrimaryButton>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {instructors.map((instructor) => (
                                            <tr key={instructor.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{`${instructor.first_name} ${instructor.middle_name ? instructor.middle_name + ' ' : ''}${instructor.last_name}`}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{instructor.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{instructor.phone}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{instructor.address}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CreateInstructorModal show={showingCreateInstructorModal} onClose={closeCreateInstructorModal} />
        </AdminLayout>
    );
}