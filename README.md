
# SwiftAid: Instant Emergency & Health Support System

## **Project Overview**

**SwiftAid** is an AI-powered healthcare platform designed to revolutionize emergency response and remote patient monitoring (RPM). The system addresses the growing challenge of delayed medical intervention and unmanaged chronic conditions by offering real-time health tracking, intelligent diagnostics, and instant emergency alerts using wearable biomedical devices and machine learning. SwiftAid aims to provide continuous care and immediate intervention, saving lives, reducing complications, and transforming healthcare from reactive to proactive.

You can access the live version of SwiftAid [here](https://swift-aid-ruby.vercel.app/).

---

## **Features**

* **Continuous Automated Monitoring**: Tracks vitals like heart rate, SpO₂, EEG, and movement using biomedical wearables. Real-time data transmission via secure MQTT ensures uninterrupted health tracking.
* **Real-Time Emergency Alerts & AI Diagnosis**: Uses machine learning models like MobileNetV2 to classify medical conditions such as burns and wounds. Immediate alerts notify emergency contacts and medical professionals.
* **Geolocation-Based SOS**: Instantly shares the patient's location with emergency contacts during crises, enabling faster emergency support.
* **Voice-Based Conversational Agent**: Interacts with users to gather symptoms and provide relevant assistance, improving accessibility and user engagement.
* **Nearby Hospitals & Trauma Centers Finder**: Helps users locate nearby healthcare facilities, trauma centers, and clinics based on specialty and proximity.
* **Smart Health Profile**: Stores user's medical info and emergency contacts. Auto-generates a QR code for easy access during emergencies.
* **Doctor Dashboard for Live Monitoring**: Real-time access to patient vitals and alerts for healthcare professionals.

---

## **Technologies Used**

* **MQTT**: For device communication and real-time data transmission.
* **MongoDB**: For database storage of health records and patient data.
* **Expo**: For mobile app development.
* **Next.js**: For the provider dashboard.
* **Next Auth**: For role-based authentication and secure user management.
* **MobileNetV2**: For real-time image classification of medical emergencies.

---

## **Next.js Setup Instructions**

This project is built using **Next.js** and bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### **Getting Started**

1. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the project.

You can start editing the page by modifying `app/page.js`, and the page will auto-update as you make changes.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load **Geist**, a font family for Vercel.

---

## **Installation**

### **Prerequisites**

* Node.js (for running the backend server)
* MongoDB (for storing health records)
* Python (for machine learning tasks like burn classification)

### **Steps to Install**

1. Clone the repository:

   ```bash
   git clone https://github.com/LivedhaS/SwiftAid.git
   ```

2. Navigate into the project directory:

   ```bash
   cd SwiftAid
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Install Python dependencies (if applicable):

   ```bash
   pip install -r requirements.txt
   ```

5. Run the Node.js server:

   ```bash
   node server.js
   ```

6. Start any necessary Python services (e.g., for the burn classification model).

7. **To View the Remote Patient Monitoring Dashboard**

   To view the vitals of patients and doctors on the frontend, follow these steps:

   * **Navigate to the `publisher` directory**:

     ```bash
     cd publisher
     ```

   * **Run the `publisher.py` script** to start streaming patient vitals:

     ```bash
     python publisher.py
     ```

   This is necessary to allow the frontend to display the real-time vitals of patients and doctors.

---

## **Usage**

* Upload burn images or input symptoms to get instant classification and treatment recommendations.
* Use the voice agent for hands-free symptom checking and advice during emergencies.
* Monitor your health remotely using connected wearable devices.
* Access health information quickly via your **Smart Health Profile** and **QR code**.

---

You can access the live version of SwiftAid [here](https://swift-aid-ruby.vercel.app/).

---
