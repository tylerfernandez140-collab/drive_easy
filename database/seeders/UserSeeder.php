<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::create([
            'first_name' => 'Admin',
            'middle_name' => null,
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'phone' => '09123456789',
            'role' => 'admin',
            'address' => 'Admin Street',
            'password' => Hash::make('password123123'), 
        ]);

       // Instructor Users
        User::create([
            'first_name' => 'Michael',
            'middle_name' => null,
            'last_name' => 'Santos',
            'email' => 'michael.santos@example.com',
            'phone' => '09123456781',
            'role' => 'instructor',
            'address' => 'Instructor Avenue',
            'password' => Hash::make('password123123'),
        ]);

        User::create([
            'first_name' => 'Carlo',
            'middle_name' => null,
            'last_name' => 'Mendoza',
            'email' => 'carlo.mendoza@example.com',
            'phone' => '09123456782',
            'role' => 'instructor',
            'address' => 'Instructor Avenue',
            'password' => Hash::make('password123123'),
        ]);

        User::create([
            'first_name' => 'Jerome',
            'middle_name' => null,
            'last_name' => 'Castillo',
            'email' => 'jerome.castillo@example.com',
            'phone' => '09123456783',
            'role' => 'instructor',
            'address' => 'Instructor Avenue',
            'password' => Hash::make('password123123'),
        ]);

        User::create([
            'first_name' => 'Ryan',
            'middle_name' => null,
            'last_name' => 'Dela Cruz',
            'email' => 'ryan.delacruz@example.com',
            'phone' => '09123456784',
            'role' => 'instructor',
            'address' => 'Instructor Avenue',
            'password' => Hash::make('password123123'),
        ]);

        User::create([
            'first_name' => 'Allan',
            'middle_name' => null,
            'last_name' => 'Fernandez',
            'email' => 'allan.fernandez@example.com',
            'phone' => '09123456785',
            'role' => 'instructor',
            'address' => 'Instructor Avenue',
            'password' => Hash::make('password123123'),
        ]);


        // Student User
        User::create([
            'first_name' => 'Student',
            'middle_name' => null,
            'last_name' => 'User',
            'email' => 'student@example.com',
            'phone' => '09123456781',
            'role' => 'student',
            'address' => 'Student Lane',
            'password' => Hash::make('password123123'),
        ]);
    }
}
