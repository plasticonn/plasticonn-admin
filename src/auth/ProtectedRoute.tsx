// import { Outlet } from "react-router-dom";
// import { useAuth } from "../utils/useAuth";

// export default function ProtectedRoute() {
//   const { user, authLoading } = useAuth();

//   if (authLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     window.location.replace("/");
//   }

//   return <Outlet />;
// }

// ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import api from "../utils/axiosInstance";
import { useAuthStore } from "../utils/useAuthStore";

export default function ProtectedRoute() {
  const [initialized, setInitialized] = useState(false);

  //   useEffect(() => {
  //     const stored = localStorage.getItem("user");
  //     if (!stored) {
  //       clearUser();
  //       setInitialized(true);
  //       return;
  //     }

  //     const parsed = JSON.parse(stored);
  //     initUser(parsed);

  //     const fetchProfile = async () => {
  //       try {
  //         const res = await api.get(`/api/${parsed.role}/profile/${parsed.id}`);
  //         if (parsed.role === "collector") setUser(res.data.data.collector);
  //         if (parsed.role === "center") setUser(res.data.data.center);
  //       } catch (err) {
  //         clearUser();
  //       } finally {
  //         setInitialized(true);
  //       }
  //     };

  //     fetchProfile();
  //   }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    api
      .get(`/api/admin/profile`)
      .then((res) => {
        setUser(res.data.data);
        setInitialized(true);
      })
      .catch(() => clearUser());
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          src="/logo.png"
          alt="Plasticonn logo"
          className="w-30 h-30 animate-spin [animation-duration:4s] hover:animate-none opacity-60"
        />
      </div>
    );
  }

  //   if (!initialized) {
  //     window.location.replace("/");
  //     return null;
  //   }

  return <Outlet />;
}
