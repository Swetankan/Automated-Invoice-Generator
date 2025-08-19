# Modern Invoice Generator

A full-stack web application built with Next.js and Node.js that allows users to create, save, download, and email professional invoices.



## Features

* **Dynamic Invoice Creation:** An intuitive, single-page form to create detailed invoices with client information, itemized lists, and payment terms.
* **Real-time Calculations:** Subtotals, taxes, and grand totals are calculated instantly as you add or edit items.
* **PDF Generation:** Download a professionally styled, print-ready PDF of any invoice with a single click.
* **Database Storage:** Save your invoice drafts to a MongoDB database for record-keeping.
* **Email Invoices Directly:** Send the generated PDF invoice directly to your client's email address from within the app.
* **Dark & Light Mode:** The user interface is fully responsive and supports both dark and light themes.

## Tech Stack

This project is a monorepo containing a separate frontend and backend.

**Frontend:**

* **Framework:** Next.js (with App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **UI:** React (with Hooks for state management)

**Backend:**

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **PDF Generation:** Puppeteer
* **Email Service:** Nodemailer

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) installed and running on your local machine, or a connection string from MongoDB Atlas.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [[https://github.com/swetankan/invoice-app](https://github.com/Swetankan/Automated-Invoice-Generator).git]
    cd invoice-app
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd ../backend
    npm install
    ```

### Configuration

Before running the application, you need to set up your environment variables for the backend.

1.  Navigate to the `backend` directory.
2.  Create a new file named `.env`.
3.  Add the following configuration variables, replacing the placeholder values with your own:
    ```env
    # Your local MongoDB connection string
    MONGODB_URI=mongodb://localhost:27017/invoice-app

    # Email Configuration (using Gmail App Password)
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-16-digit-google-app-password
    ```

### Running the Application

You will need to run the frontend and backend servers in two separate terminals.

**Terminal 1: Start the Backend Server**
```bash
cd backend
npx ts-node-dev index.ts
