/* README (short) */
// 1. copy .env.example with VITE_API_BASE=http://localhost:8000/api/v1
// 2. npm install
// 3. npm run dev

/* Notes */
// - This frontend uses localStorage for accessToken to attach Authorization header. The backend also sets cookies; adapt as needed for secure deployment.
// - Design focuses on responsiveness and a clean, modern UI using Tailwind. You can expand styles and animations (Framer Motion) for extra polish.
// - For production, prefer secure httpOnly cookies + server-side refresh and avoid localStorage for tokens.

// End of frontend scaffold