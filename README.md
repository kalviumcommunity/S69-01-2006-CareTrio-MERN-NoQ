# 🏥 NoQ - Smart Digital Queue Management

![NoQ Banner](https://img.shields.io/badge/Status-Live-green?style=for-the-badge) 
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?style=for-the-badge&logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite)

**NoQ** is a modern, web-based digital queue management system designed to eliminate chaos in hospital waiting rooms. It empowers patients to book appointments from home and track their status in real-time, while giving doctors a powerful dashboard to manage patient floww efficiently.

---

## � Key Features

### 🩺 For Doctors (Dashboard)
- **Live Queue Management**: Call the next patient, skip absentees, or mark consultations as done with one click.
- **Smart Status**: Tracks "Waiting", "In Consultation", "Skipped", and "Completed" patients.
- **Consultation Records**: Log diagnosis, medicines, and remarks for every patient.
- **History Management**: View and delete today's treated patient records.

### 📱 For Patients
- **Instant Booking**: Simple registration form (Name, Phone, Department) to get a digital token.
- **Live Tracking**: View the current token being served from anywhere—no more waiting in crowded halls.
- **Real-Time Updates**: Status updates ("Your turn is next!") to reduce anxiety.

### 📺 Public Display (TV Mode)
- **Queue Monitor**: A dedicated, auto-refreshing page (`/queue`) designed for large clinic TV screens to show the current and upcoming tokens.

---

## �️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (Lightweight, zero-config)
- **Animations**: Framer Motion
- **Notifications**: Nodemailer (Email), React Hot Toast

---

## ⚡ Getting Started

Follow these steps to run **NoQ** locally on your machine.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/noq-system.git
cd noq-system
```

### 2️⃣ Backend Setup
The backend runs on port `5000` and handles the SQLite database.

```bash
cd Backend
npm install
npm start
```
*You should see: `🚀 Backend running on http://localhost:5000`*

### 3️⃣ Frontend Setup
The frontend runs on port `3000`. Open a **new terminal**.

```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:3000` in your browser.*

---

## � Screenshots

| **Home Page** | **Doctor Dashboard** |
|:---:|:---:|
| *Professional Landing Page for Patients & Doctors* | *Manage Queue, Consult & Skip Patients* |

| **Live Queue (TV)** | **Mobile Booking** |
|:---:|:---:|
| *Auto-updating Public Display* | *Fast Token Generation for Patients* |

---

## 🤝 Contributing

We welcome contributions! Please fork the repo and submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Attribute-NonCommercial-NoDerivs 4.0 International