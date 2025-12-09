import React from 'react';
import Modal from '@/Components/ui/Modal';
import InputLabel from '@/Components/ui/Input/InputLabel';
import TextInput from '@/Components/ui/Input/TextInput';
import InputError from '@/Components/ui/Input/InputError';
import PrimaryButton from '@/Components/ui/Button/PrimaryButton';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function CreateInstructorModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        phone: '',
        email: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.admin.instructors.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md" maxHeight="full">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Create New Instructor Account
                </h2>

                <div className="mt-6 flex gap-4">
                    <div className="flex-1">
                        <InputLabel htmlFor="first_name" value="First Name" />
                        <TextInput
                            id="first_name"
                            name="first_name"
                            value={data.first_name}
                            className="mt-1 block w-full"
                            autoComplete="first_name"
                            isFocused={true}
                            onChange={(e) => setData('first_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>

                    <div className="flex-1">
                        <InputLabel htmlFor="middle_name" value="Middle Name" />
                        <TextInput
                            id="middle_name"
                            name="middle_name"
                            value={data.middle_name}
                            className="mt-1 block w-full"
                            autoComplete="middle_name"
                            onChange={(e) => setData('middle_name', e.target.value)}
                        />
                        <InputError message={errors.middle_name} className="mt-2" />
                    </div>
                </div>

                <div className="mt-4 flex gap-4">
                    <div className="flex-1">
                        <InputLabel htmlFor="last_name" value="Last Name" />
                        <TextInput
                            id="last_name"
                            name="last_name"
                            value={data.last_name}
                            className="mt-1 block w-full"
                            autoComplete="last_name"
                            onChange={(e) => setData('last_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>

                    <div className="flex-1">
                        <InputLabel htmlFor="phone" value="Phone" />
                        <TextInput
                            id="phone"
                            type="text"
                            name="phone"
                            value={data.phone}
                            className="mt-1 block w-full"
                            autoComplete="phone"
                            onChange={(e) => setData('phone', e.target.value)}
                            required
                        />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="address" value="Address" />
                    <TextInput
                        id="address"
                        type="text"
                        name="address"
                        value={data.address}
                        className="mt-1 block w-full"
                        autoComplete="address"
                        onChange={(e) => setData('address', e.target.value)}
                        required
                    />
                    <InputError message={errors.address} className="mt-2" />
                </div>

                <div className="mt-4 relative">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full pr-10"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                    >
                        {showPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-500" />
                        ) : (
                            <FaEye className="h-5 w-5 text-gray-500" />
                        )}
                    </button>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 relative">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full pr-10"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                    >
                        {showConfirmPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-500" />
                        ) : (
                            <FaEye className="h-5 w-5 text-gray-500" />
                        )}
                    </button>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end">
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Create Account
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}