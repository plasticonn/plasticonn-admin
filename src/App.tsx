import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "nprogress/nprogress.css";
import api from "./utils/axiosInstance";
import { useAuthStore } from "./utils/useAuthStore";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const Centers = React.lazy(() => import("./pages/Centers"));
const Collectors = React.lazy(() => import("./pages/Collectors"));
const Activity_logs = React.lazy(() => import("./pages/Activity_logs"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Admins = React.lazy(() => import("./pages/Admins"));
const SignIn = React.lazy(() => import("./pages/auth/SignIn"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const Website = React.lazy(() => import("./pages/Website"));

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    api
      .get(`/api/admin/profile`)
      .then((res) => setUser(res.data.data.admin))
      .catch(() => clearUser());
  }, []);

  // usePageLoader();

  // if (authLoading) {
  //   return "Loading...";
  // }

  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/centers" element={<Centers />} />
        <Route path="/collectors" element={<Collectors />} />
        <Route path="/activity_logs" element={<Activity_logs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admins" element={<Admins />} />
        <Route path="/website" element={<Website />} />
      </Routes>
    </>
  );
}

export default App;
