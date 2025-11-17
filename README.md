# DriveEasy – Driving School Management System

**Drive Easy** 
---

## 🚀 Features

- Full-stack SPA powered by Laravel + Inertia.js + React  
- Student registration and course enrollment  
- Admin dashboard for student approval and scheduling  
- Instructor dashboard with assigned students, evaluations, and calendar view  
- Student portal to view schedule, performance ratings, and results  
- Certificate download for passed students  
- Access to learning materials for students who need improvement  
- Admin panel to upload and manage PDFs and YouTube video materials  
- Responsive design using Tailwind CSS 

---

## 🧰 Tech Stack

- **Backend:** Laravel 12
- **Frontend:** React.js (via Inertia.js)
- **Styling:** Tailwind CSS
- **PDF Generation:** [barryvdh/laravel-dompdf](https://github.com/barryvdh/laravel-dompdf)

---

## ⚙️ Installation & Setup

Follow the steps below to set up the project locally:

### 1. Clone the Repository
```bash
git clone <your-repo-link>
cd driveeasy

### 2.Install PHP Dependencies
```bash
composer install

### 3.Rename .env.example to .env 
```bash
cp .env.example .env

### 4. Run this to your terminal 
```bash
php artisan storage:link
php artisan  key:generate
php artisan migrate --seed
php artisan storage:link
npm install -D tailwindcss-animate
### 5. Install JS Dependencies 
```bash
npm install 
npm install react-icons 
npm install react-hot-toast

### 6. Install and Configure DomPDF
```bash
composer require barryvdh/laravel-dompdf
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"


### 7. Run the server 
```bash
php artisan serve
npm run dev 

###  User Credentials
Admin -> admin@example.com 
password -> password123123
```bash
Instructor -> instructor@example.com 
password -> password123123
```bash
Student  -> student@example.com 
password -> password123123



