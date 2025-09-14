# GEMINI.MD: AI Collaboration Guide

This document provides essential context for AI models interacting with this project. Adhering to these guidelines will ensure consistency and maintain code quality.

## 1. Project Overview & Purpose

* **Primary Goal:** "BookForum" is a modern, real-time, interactive book discussion platform designed to create an engaging space for readers to connect, share insights, and explore literature together. It features live discussions, a dynamic voting system, and a gamified user progression system.
* **Business Domain:** Social Media, Online Community, Publishing.

## 2. Core Technologies & Stack

* **Languages:** JavaScript (ES6+)
* **Frameworks & Runtimes:** Node.js, React.js (v18)
* **Databases:** Firebase Firestore
* **Key Libraries/Dependencies:**
    *   `react-router-dom`: For client-side routing.
    *   `firebase`: For backend services (Authentication and Firestore).
    *   `@google/generative-ai`: For integration with Google's generative AI models.
    *   `sentiment`: For client-side sentiment analysis.
    *   `tailwindcss`: For utility-first CSS styling.
* **Package Manager(s):** npm

## 3. Architectural Patterns

* **Overall Architecture:** Serverless, Single-Page Application (SPA). The frontend is a React application that communicates directly with Firebase services. Some backend logic is likely handled by Firebase Functions (inferred from `firebase-admin` dependency, although no functions are visible in the provided file structure).
* **Directory Structure Philosophy:**
    *   `/src`: Contains all the React application's source code.
    *   `/src/components`: Contains reusable React components, organized by feature (e.g., `posts`, `auth`, `comments`).
    *   `/src/contexts`: Contains React context providers for global state management (e.g., `FirebaseContext`).
    *   `/src/config`: Contains configuration files, such as the Firebase initialization.
    *   `/api`: Contains server-side code, likely for cron jobs or API endpoints deployed as serverless functions.
    *   `/public`: Contains static assets like images and the main `index.html` file.

## 4. Coding Conventions & Style Guide

* **Formatting:** Based on the `.eslintrc.js` and observed code, the project uses standard JavaScript/React formatting. Indentation is 2 spaces.
* **Naming Conventions:**
    *   `variables`, `functions`: camelCase (`myVariable`)
    *   `components`: PascalCase (`MyComponent`)
    *   `files`: PascalCase or camelCase for components (`MyComponent.jsx`), and camelCase for other JS files (`bookUtils.js`).
* **API Design:** The application communicates with Firebase Firestore, which is a NoSQL document database. The interaction is not strictly RESTful but follows Firestore's SDK patterns (e.g., `collection`, `doc`, `onSnapshot`).
* **Error Handling:** Primarily uses `try...catch` blocks for asynchronous operations, with error logging to the console.

## 5. Key Files & Entrypoints

* **Main Entrypoint(s):** `src/main.jsx` is the entry point for the React application.
* **Configuration:**
    *   `src/config/firebase.js`: Firebase configuration and initialization.
    *   `vite.config.js`: Vite configuration.
    *   `tailwind.config.js`: Tailwind CSS configuration.
    *   `.firebaserc`: Firebase project configuration.
* **CI/CD Pipeline:** No CI/CD pipeline is explicitly defined in the provided file structure. The `vercel.json` file suggests deployment to Vercel.

## 6. Development & Testing Workflow

* **Local Development Environment:**
    1.  Clone the repository.
    2.  Run `npm install` to install dependencies.
    3.  Set up a `.env` file with Firebase configuration.
    4.  Run `npm run dev` (which executes `vite`) to start the local development server.
* **Testing:** There are no visible test files or testing-related scripts in `package.json`. This is an area that could be improved.
* **CI/CD Process:** When code is pushed to the main branch, Vercel likely automatically builds and deploys the application (inferred from `vercel.json` and common Vercel workflows).

## 7. Specific Instructions for AI Collaboration

* **Contribution Guidelines:** No `CONTRIBUTING.md` file was found. When contributing, follow the existing code patterns and architectural principles outlined in this document.
* **Infrastructure (IaC):** No Infrastructure as Code directory was found.
* **Security:** Be mindful of security. Do not hardcode secrets or keys. Ensure any changes to authentication logic are secure and vetted. All user-generated content should be treated as untrusted.
* **Dependencies:** When adding a new dependency, use `npm install` and update the `package.json` file.
* **Commit Messages:** No specific commit message convention is enforced. However, it is recommended to write clear and descriptive commit messages.
