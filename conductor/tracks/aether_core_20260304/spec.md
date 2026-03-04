# Track Specification: Aether Core & Admin Command Center

## Track Overview
Build the foundation of Aether Electronix, focusing on the "Spatial E-commerce" experience (3D Stage & AI Concierge) and the iOS-style Admin Command Center with secure authentication.

## Core Features
1.  **3D Product Experience (Three.js):** 
    -   A high-fidelity 3D Stage for rotating and zooming gadgets.
    -   GSAP animations for "Unboxing" and "Fly-to-Cart" interactions.
2.  **AI "Aether Concierge" (Gemini API):**
    -   Natural language search portal.
    -   Curated recommendations based on user intent.
3.  **Authentication & Identity (Clerk/Auth0):**
    -   Social Login (Google, Facebook).
    -   Role-based access (User vs. Admin).
    -   Secure Admin initialization with default credentials.
4.  **Admin Command Center (iOS Aesthetic):**
    -   Inventory management with "Availability" toggles.
    -   Global discount dial with real-time push updates.
5.  **Data Persistence (PostgreSQL + Drizzle):**
    -   Schema for Products, Users, and Orders.
    -   Zod validation for all API interactions.

## Technical Architecture
-   **Frontend:** Next.js (TypeScript), Three.js (R3F), GSAP.
-   **Backend:** Express (TypeScript), Socket.io (Real-time).
-   **Database:** PostgreSQL with Drizzle ORM.
-   **AI:** Google Gemini API.
