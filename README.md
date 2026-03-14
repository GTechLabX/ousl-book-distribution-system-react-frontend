
# 📚 OUSL Book Distribution System – React Frontend

A **React.js frontend** for the **Open University of Sri Lanka (OUSL)** Book Distribution System.
It helps students request and reserve books before visiting the center, and allows admins and staff to manage inventory and distribution efficiently.

This system is designed for **Superadmin, Staff, and Student roles**, leverages a **loosely coupled architecture**, and is ready for **microservice integration**. It also supports **QR code scanning** for fast book issuing and management.

Whether you are a beginner or a professional, exploring this project will help you **enhance your knowledge and grow in your IT journey**.

---

## 🚀 Tech Stack

* **React.js** + **Vite**
* **React Router v6**
* **Tailwind CSS / Material UI**
* **Axios** for API requests

---

## ⚙️ Setup

```bash
# Clone the repo
git clone https://github.com/<your-username>/OUSL-Book-Distribution-System-React-Frontend.git
cd OUSL-Book-Distribution-System-React-Frontend

# Install dependencies
npm install

# Add your backend API URL in .env
VITE_API_URL=http://localhost:8000/api

# Run the app
npm run dev
```

> **Note:**
> Make sure your Django backend is running and accessible at the URL you provide in `VITE_API_URL`.

---

## 📁 Project Structure

```
src/
 ├── components/      # Reusable UI components
 ├── pages/           # All app pages (Dashboard, Login, Book Request, etc.)
 ├── api/             # Axios API calls
 ├── routes/          # Route definitions
 └── App.jsx          # Main app entry
```

---

## ✨ Features

* **User Roles:** Superadmin, Staff, Student

* **Student Features:**

  * Book search, request, and reservation before visiting the center
  * Track request status: Pending, Approved, Ready for Collection


* **Staff Features:**

  * QR code scanning for books
  * Book issuing and inventory updates
  * View and manage student requests

* **Superadmin Features:**

  * Manage all users, books, and requests
  * Access full dashboard analytics
  * Approve or reject book requests

* **General Features:**

  * Loosely coupled system, microservice-ready architecture
  * Responsive UI for desktops, tablets, and mobiles
  * Notifications for book issues, approvals, and low stock

---

## 👨‍💻 Documented By

**Gangula Sandaru Dinusantha**

I hope anyone who explores this project **enhances their knowledge** and grows in their **IT industry journey** using this work.

**Happy coding! 😊**

