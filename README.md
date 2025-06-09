# 🆘 Beacon Safe Connect

Beacon Safe Connect is a real-time emergency response platform built with **React + TypeScript** and **Supabase**. It enables users to instantly send SOS alerts, automatically notifying nearby hospitals and responders within a 5 km radius.

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - Role-based auth for **users**, **responders**, and **hospitals**
  - Supabase Auth integration

- 🗺️ **SOS Emergency System**
  - Users can trigger an SOS alert with live geolocation
  - Real-time notifications sent to hospitals/responders within 5 km
  - Hospital dashboard receives filtered emergency requests

- 📡 **Real-Time Updates**
  - Live sync of SOS data using Supabase channels
  - No refresh needed — new alerts appear instantly

- 🏥 **Hospital Dashboard**
  - See only emergency requests relevant to the logged-in hospital
  - Mark requests as "Responded" or "Resolved"
  - Stats for active, in-progress, and resolved emergencies

- 👤 **User Dashboard**
  - Trigger SOS
  - View response status and track nearby hospitals

- 📦 **Technology Stack**
  - **Frontend**: React, TypeScript, Tailwind CSS
  - **Backend**: Supabase (PostgreSQL, Realtime, Auth)
  - **Geolocation**: HTML5 Geolocation API
  - **Routing**: React Router

