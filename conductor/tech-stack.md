# Tech Stack: Aether Electronix

## Frontend (The Experience)
- **Framework:** React (TypeScript) or Next.js for high-performance UI and component lifecycle management.
- **3D Engine:** Three.js for rendering gadgets in a 3D stage with zoom and rotation.
- **Motion Library:** GSAP (GreenSock Animation Platform) for high-end "haptic" feel, glassmorphism, and fluid physics.
- **Styling:** Vanilla CSS for maximum flexibility and performance in creating iOS-style glassmorphism.

## Backend (The Intelligence)
- **Runtime:** Node.js (Express) with TypeScript for a unified, type-safe development environment.
- **Real-time Engine:** Socket.io / WebSockets for producer-client chat and live stock updates.
- **AI Integration:** Gemini API for the "Aether Concierge" natural language search and recommendations.

## Infrastructure & Data
- **Database:** PostgreSQL for robust product catalogs and transaction management.
- **ORM:** Drizzle ORM for type-safe database interactions and migrations.
- **Validation:** Zod for runtime schema validation and data integrity.
- **Authentication:** Custom JWT Auth (bcrypt + jsonwebtoken) for secure, self-hosted user management.

## Deployment & Monitoring
- **Hosting:** Vercel (Frontend) and AWS or Render (Backend).
- **CI/CD:** GitHub Actions for automated testing and deployment pipelines.
