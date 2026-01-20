# S69-01-2006-CareTrio-MERN-NoQ
This is your first 🏥 Digital Queue Management System

A lightweight, web-based digital queue management system designed for Tier-2 and Tier-3 hospitals to reduce waiting chaos, improve patient flow, and provide real-time queue visibility — without expensive hardware.

📌 Problem Context

In many Tier-2/3 cities, hospitals still rely on physical queues for appointments. This leads to:

Long patient waiting times

Overcrowding and confusion

No real-time queue visibility

Stress for both patients and hospital staff

This project aims to solve these challenges using a simple, mobile-friendly, and low-cost digital solution.

🎯 Project Goal

To build a web-based queue system that enables:

✔ Patients to take digital tokens

✔ Hospitals to manage queues in real time

✔ Doctors to call patients smoothly

✔ Optional SMS/WhatsApp-style notifications

All while being:

Simple to use

Mobile-friendly

Easy to adopt

Affordable for small hospitals

🟢 Key Features
MVP (Week 1–3)

Patient Registration (Name, Phone, Department)

Digital Token Generation

Live Queue Dashboard (Now Serving, Estimated Time)

Hospital / Doctor Panel

View patient list

Call next patient

Skip patient

Mark completed

Basic Authentication (Admin / Hospital Login)

Responsive UI using Tailwind CSS

🟡 Nice-to-Have (Week 4)

WhatsApp / SMS / Email Notifications

Queue Analytics (Daily patients, Peak hours)

Multilingual Support (English + Hindi)

Print Token Option

Role-Based Access (Admin / Staff / Doctor)

🛠 Tech Stack
Frontend

Next.js – Routing, SSR, performance

Tailwind CSS – Clean and fast UI

Backend

Node.js + Express

RESTful APIs

Database

MongoDB Atlas

Deployment

Frontend: Vercel / AWS Amplify

Backend: Render / AWS EC2 / Azure App Service

Database: MongoDB Atlas

Tools

GitHub (Version control & PRs)

Postman (API testing)

Figma (Wireframes)

Trello / Jira (Task tracking)

🧱 System Architecture
Patient → Registration Form → Token Generated → Queue Updated
Doctor/Hospital Panel → Controls Queue → Calls Patient
Live Dashboard → Displays Real-Time Queue Status

Frontend (Next.js)
        ↕
Backend API (Express)
        ↕
MongoDB Atlas

👥 Team Roles
Member	Role	Responsibilities
Devansh	Full-Stack Lead	Backend APIs, DB schema, repo setup
Sonica	Frontend Lead	UI, forms, dashboard pages
Sanskar	DevOps & Testing	Deployment, environment, testing

All members collaborate on documentation and sprint reviews.

🗓 Sprint Timeline (4 Weeks)
✅ Week 1 – Planning & Setup

Feature finalization

Wireframes

Repo setup

Next.js + Express boilerplate

MongoDB connection

Deliverables:
✔ Architecture diagram
✔ Basic UI skeleton
✔ Repo initialized

✅ Week 2 – Core MVP Development

Patient registration form

Token generation logic

Queue APIs

Basic hospital dashboard

Deliverables:
✔ Token system working
✔ Queue stored & displayed

✅ Week 3 – Queue Management & Auth

Hospital login

Call next / skip patient

Realtime updates (polling)

UI improvements

Deliverables:
✔ End-to-end queue flow
✔ MVP demo-ready

✅ Week 4 – Enhancements & Deployment

Notifications (optional)

Analytics dashboard

Error handling

Deployment

Final documentation

Deliverables:
✔ Live hosted app
✔ Demo video
✔ Final report

✅ Definition of Done

A feature is considered DONE when:

Code merged into main

Tested on mobile & desktop

Documented clearly

Deployed and accessible online

📊 Success Criteria

The project is successful if:

✔ Queue creation completes within 10 seconds

✔ 20+ patients can be handled smoothly

✔ Doctors can call next patient without refresh

✔ App works on low internet speeds

✔ Live deployment link available

🏁 Conclusion

This project delivers a practical, scalable, and affordable digital queue system tailored for hospitals in Tier-2/3 cities — improving patient experience and hospital efficiency without costly infrastructure!
