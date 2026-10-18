# Dev Nexus

React + Tailwind + Motion front end for the multi-agent website builder.

## Run
1. Install Node.js 18+
2. npm install
3. npm run dev   → http://localhost:5173
4. npm run build → dist/  (npm run preview to test the build)

## Routes
/          landing page
/login     log in
/signup    create account
/builder   prompt page (requires login)

## Structure
src/
  components/        reusable UI: Button, Container, Logo, SectionHeading, Reveal,
                     GlowBackground, Input, PasswordInput, Checkbox, Divider,
                     SocialButtons, ProtectedRoute, ScrollToTop
  config/            site name and agent pipeline
  context/           AuthContext (user, login, signup, logout)
  services/          buildApi.js and authApi.js — connect your backend here
  pages/
    LandingPage/     landing page sections + data
    AuthPages/       LoginPage, SignupPage, shared components/ and validators.js
    BuilderPage/     prompt page, components/ and hooks/
  routes.jsx         route table

## Connect your backend
- Auth: edit src/services/authApi.js (examples in the comments)
- Builds: edit src/services/buildApi.js
- Copy .env.example to .env and set VITE_API_URL

## Add a page
1. Create src/pages/YourPage/index.jsx
2. Add { path: "/your-page", element: <YourPage /> } to src/routes.jsx
   (wrap in <ProtectedRoute> to require login)

## Deploying
vercel.json (Vercel) and public/_redirects (Netlify) are included so refreshing
/builder or /login does not return a 404.
