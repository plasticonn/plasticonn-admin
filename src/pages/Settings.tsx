import { Avatar, Typography } from "@mui/material";
import Pages from "../container/Pages";
import Change_Password from "../components/settings/Change_Password";
import Edit_Profile from "../components/settings/Edit_Profile";
import { LuUserRound } from "react-icons/lu";
import { useAuthStore } from "../utils/useAuthStore";
import Profile_details from "../components/settings/Profile_details";

const Settings = () => {
  const { user } = useAuthStore();

  return (
    <Pages page="Settings" helperText="View and manage your profile">
      <div className="flex flex-col p-6 bg-[#FAFAFA] border-[0.4px] border-[#1A1A1A80] rounded-xl mx-5">
        <div className="flex gap-4 items-center">
          <LuUserRound size={26} color="#00C281" />
          <Typography color="#1A1A1A" fontWeight={400} fontSize={26}>
            Admin Profile
          </Typography>
        </div>

        <div className="flex gap-4.5 items-center mt-6">
          <Avatar sx={{ width: 56, height: 56 }} />

          <div className=" flex flex-col gap-4.5">
            <div>
              <Typography color="#1A1A1A" fontWeight={400} fontSize={18}>
                {user?.name}
              </Typography>
              <Typography color="#1A1A1A99" fontWeight={400} fontSize={14}>
                {user?.email}
              </Typography>
            </div>

            <div className="flex gap-4">
              <Edit_Profile />
              <Change_Password />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-5 mt-6">
        <Profile_details />
      </div>
    </Pages>
  );
};

export default Settings;
