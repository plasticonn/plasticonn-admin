import { Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { SlLocationPin } from "react-icons/sl";
import { LuChartSpline } from "react-icons/lu";
import { LuClock } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { MdWeb } from "react-icons/md";

const Sidebar = () => {
  const sideMenuList = [
    { icon: <LuLayoutDashboard />, name: "Dashboard", link: "/dashboard" },
    { icon: <LuUsersRound />, name: "Collectors", link: "/collectors" },
    { icon: <SlLocationPin />, name: "Centers", link: "/centers" },
    { icon: <MdWeb />, name: "Website", link: "/website" },
    { icon: <LuChartSpline />, name: "Data & Analytics", link: "/analytics" },
    {
      icon: <LuClock />,
      name: "Activity Logs",
      link: "/activity_logs",
    },
    { icon: <MdOutlineAdminPanelSettings />, name: "Admins", link: "/admins" },
    { icon: <IoSettingsOutline />, name: "Settings", link: "/settings" },
  ];

  const navigate = useNavigate();
  const location = useLocation().pathname;

  return (
    <div className="border-r-[0.5px] border-r-[#1A1A1A80] h-full w-full md:w-64 lg:w-72 xl:w-80">
      <div className="flex gap-2 md:gap-2.5 items-center p-3 md:p-4 lg:p-5">
        <img
          src="/logo.png"
          className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
        />
        <Typography
          className="text-2xl! md:text-3xl! lg:text-4xl!"
          fontWeight={400}
          color="#043B24"
        >
          Plasticonn
        </Typography>
      </div>

      <div className="mt-4 md:mt-6 lg:mt-8">
        {sideMenuList.map((menu) => {
          const isActive = location == menu.link;

          return (
            <div
              key={menu.link}
              onClick={() => navigate(menu.link)}
              className={`w-[90%] md:w-44 lg:w-50 rounded-xl h-10 md:h-10.5 lg:h-11 ml-3 md:ml-6 lg:ml-10 pl-2.5 md:pl-3 mb-2 md:mb-2.5 lg:mb-3 cursor-pointer flex items-center gap-2.5 md:gap-3 lg:gap-3.5 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-[#00C2811A] ${
                isActive ? "bg-[#00C2811A] scale-105 shadow-md" : ""
              }`}
            >
              <div
                className={`h-4 w-3.5 md:h-4.5 md:w-4 transition-colors duration-300 ease-in-out ${
                  isActive ? "text-[#00C281]" : "text-[#1A1A1A]"
                } group-hover:text-[#00C281]`}
              >
                {menu.icon}
              </div>
              <Typography
                className="text-base! md:text-lg! transition-colors duration-300 ease-in-out"
                color={isActive ? "#00C281" : "#1A1A1A"}
                fontWeight={400}
              >
                {menu.name}
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
