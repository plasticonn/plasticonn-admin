import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Typography from "@mui/material/Typography";
import { Avatar, Badge, Divider } from "@mui/material";
import { IoNotificationsOutline } from "react-icons/io5";
import { useAuthStore } from "../utils/useAuthStore";
import { useNavigate } from "react-router-dom";

interface PagesProps {
  children?: React.ReactNode;
  page?: string;
  helperText?: string;
}

const Pages: React.FC<PagesProps> = ({ children, page, helperText }) => {
  const { user, clearUser } = useAuthStore();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogout = () => {
    navigate("/", { replace: true });
    clearUser();
  };

  return (
    <div className="flex h-screen">
      <div className="w-fit md:w-64 lg:w-72 xl:w-80 shrink-0">
        <Sidebar />
      </div>

      <div className="bg-linear-to-br from-[#DFFFF6] to-[#FAFAFA] w-full overflow-y-auto">
        <div className="px-3 md:px-4 lg:px-5 py-3 md:py-3.5 lg:py-4 flex justify-between items-start gap-3">
          <div className="min-w-0">
            <Typography
              className="text-lg! md:text-xl! lg:text-2xl! truncate"
              color="#1A1A1A"
              fontWeight={400}
            >
              {page}
            </Typography>
            <Typography
              className="text-lg! md:text-xl! lg:text-2xl! truncate"
              color="#1A1A1A99"
              fontWeight={400}
            >
              {helperText}
            </Typography>
          </div>

          <div className="flex gap-2.5 md:gap-3 lg:gap-4 items-center shrink-0">
            <Badge
              badgeContent={4}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#00C281",
                  color: "white",
                },
              }}
            >
              <IoNotificationsOutline
                className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                color="#1A1A1AB2"
              />
            </Badge>
            <Divider orientation="vertical" flexItem />

            <div
              className="relative flex gap-2 md:gap-2.5 lg:gap-3 items-center"
              ref={menuRef}
            >
              <div className="hidden md:block text-right lg:text-left">
                <Typography
                  className="text-sm! lg:text-base!"
                  color="#1A1A1A"
                  fontWeight={400}
                >
                  {user?.name}
                </Typography>
                <Typography
                  className="text-xs! lg:text-xs!"
                  color="#1A1A1AB2"
                  fontWeight={400}
                >
                  {user?.role || "admin"}
                </Typography>
              </div>

              {/* Avatar */}
              <button onClick={() => setOpen((prev) => !prev)}>
                <Avatar className="cursor-pointer w-8! h-8! md:w-9! md:h-9! lg:w-10! lg:h-10!" />
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 top-11 md:top-12 w-36 md:w-40 bg-white rounded-lg shadow-lg border z-10">
                  <button
                    className="w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm hover:bg-gray-100"
                    onClick={() => {
                      setOpen(false);
                      navigate("/settings");
                    }}
                  >
                    Settings
                  </button>

                  <button
                    className="w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-red-600 hover:bg-gray-100"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default Pages;
