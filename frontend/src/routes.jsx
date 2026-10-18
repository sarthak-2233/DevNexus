import { ProtectedRoute } from "@/components";
import LandingPage from "@/pages/LandingPage";
import BuilderPage from "@/pages/BuilderPage";
import LoginPage from "@/pages/AuthPages/LoginPage";
import SignupPage from "@/pages/AuthPages/SignupPage";

// To add a page: create src/pages/YourPage/index.jsx and add a line here.
// Wrap it in <ProtectedRoute> if it needs a logged-in user.
export const routes = [
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/builder", element: <ProtectedRoute><BuilderPage /></ProtectedRoute> },
];
