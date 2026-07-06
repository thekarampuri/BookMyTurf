# 🏟️ Turf Booking and Management System

A modern web-based **Turf Booking and Management System** that enables users to easily search, book, and manage sports turf reservations while providing administrators with a powerful dashboard to manage bookings, turfs, users, and payments.

---

## 📌 Overview

The Turf Booking and Management System is designed to simplify the process of reserving sports turfs online. Users can browse available grounds, check slot availability, make secure bookings, and manage their reservations. Administrators can efficiently manage turf details, booking schedules, customer information, and payment records through an intuitive dashboard.

---

## ✨ Features

### 👤 User Features

* User Registration & Login
* Secure Authentication
* Browse Available Turfs
* View Turf Details
* Check Real-Time Slot Availability
* Book Turf Online
* Cancel or Modify Bookings
* Booking History
* User Profile Management
* Responsive Design

### 🛠️ Admin Features

* Admin Dashboard
* Manage Turf Listings
* Add/Edit/Delete Turfs
* Manage Booking Requests
* Approve or Cancel Bookings
* Manage Users
* View Booking Reports
* Payment Management
* Dashboard Analytics

---

## 📷 Modules

### User Module

* Registration
* Login
* Browse Turfs
* Slot Booking
* Booking History
* Profile Management

### Admin Module

* Dashboard
* Turf Management
* Booking Management
* User Management
* Reports & Analytics
* Payment Monitoring

---

## 🏗️ System Architecture

```
User
   │
   ▼
Frontend (HTML/CSS/JavaScript)
   │
   ▼
Backend (PHP)
   │
   ▼
MySQL Database
```

---

## 💻 Technology Stack

| Category        | Technology                         |
| --------------- | ---------------------------------- |
| Frontend        | HTML5, CSS3, JavaScript, Bootstrap |
| Backend         | PHP                                |
| Database        | MySQL                              |
| Server          | XAMPP / Apache                     |
| Version Control | Git & GitHub                       |

---

## 📁 Project Structure

```
Turf-Booking-System/
│
├── admin/
│   ├── dashboard.php
│   ├── bookings.php
│   ├── users.php
│   ├── turfs.php
│   └── reports.php
│
├── user/
│   ├── login.php
│   ├── register.php
│   ├── profile.php
│   ├── bookings.php
│   └── dashboard.php
│
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
│
├── database/
│   └── turf_booking.sql
│
├── includes/
│   ├── config.php
│   ├── header.php
│   └── footer.php
│
├── index.php
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/turf-booking-system.git
```

### 2. Move the Project

Copy the project folder into your web server directory.

Example (XAMPP):

```
C:\xampp\htdocs\
```

### 3. Create Database

* Open **phpMyAdmin**
* Create a new database:

```
turf_booking
```

### 4. Import Database

Import the SQL file:

```
database/turf_booking.sql
```

### 5. Configure Database

Update the database credentials inside:

```
includes/config.php
```

```php
$host = "localhost";
$user = "root";
$password = "";
$database = "turf_booking";
```

### 6. Run the Project

Start:

* Apache
* MySQL

Open your browser:

```
http://localhost/Turf-Booking-System
```

---

## 🗄️ Database Tables

* Users
* Admin
* Turfs
* Bookings
* Payments
* Time Slots

---

## 🔐 Authentication

* Secure Login
* Session Management
* Role-Based Access (Admin/User)
* Password Encryption (Recommended)

---

## 📊 Future Enhancements

* Online Payment Gateway Integration
* Email & SMS Notifications
* QR Code Booking Verification
* Mobile Application
* Google Maps Integration
* Coupon & Discount System
* Ratings & Reviews
* AI-Based Slot Recommendations
* Multi-Turf Management
* Live Availability Tracking

---

## 📸 Screenshots

Add screenshots of:

* Home Page
* Login Page
* Turf Listing
* Booking Page
* User Dashboard
* Admin Dashboard

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push the branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Akhil Karampuri**

* GitHub: https://github.com/thekarampuri
* Email: [akhilkarampuri25@gmail.com](mailto:akhilkarampuri25@gmail.com)

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
