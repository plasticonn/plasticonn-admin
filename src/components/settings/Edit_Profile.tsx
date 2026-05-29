import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import Change_Photo from "./Change_Photo";
import { useAuthStore } from "../../utils/useAuthStore";
import { useToast } from "../../utils/useToast";
import api from "../../utils/axiosInstance";
import Toast from "../../utils/Toast";

const Edit_Profile = () => {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const { user, setUser } = useAuthStore.getState();

  const [update, setUpdate] = useState({
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
  });

  const { toast, showToast, closeToast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    setLoading(true);

    try {
      const response = await api.put("/api/admin/profile", update);

      setLoading(false);

      setUser(response.data.data.admin);

      showToast(
        "Profile updated. Login for changes to reflect",
        "success",
        "/",
      );
    } catch (error: any) {
      const errMsg = error?.response?.data?.message;
      console.log(errMsg);

      showToast(errMsg, "error");

      if (errMsg) {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />

      <Button
        onClick={() => setOpen(true)}
        sx={{
          width: "106px",
          height: "48px",
          paddingY: "8px",
          //paddingX: "12px",
          borderRadius: "12px",
          backgroundColor: "#00C281",
          color: "white",
        }}
      >
        <Typography
          fontWeight={400}
          fontSize={16}
          sx={{ textTransform: "capitalize" }}
        >
          Edit Profile
        </Typography>
      </Button>

      <Dialog open={open}>
        <DialogContent
          sx={{
            width: "600px",
            padding: "36px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div className="flex justify-between items-center">
            <Typography fontWeight={400} fontSize={26} color="#1A1A1A">
              Edit Profile
            </Typography>

            <IoCloseOutline
              onClick={() => {
                setOpen(false);
                setUpdate({
                  name: user?.name,
                  email: user?.email,
                  phone: user?.phone,
                });
              }}
              size={20}
              color="#1A1A1A"
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className="flex justify-center">
            <Change_Photo />
          </div>

          <div>
            <Typography fontWeight={400} fontSize={18} color="#1A1A1A">
              Full Name
            </Typography>
            <TextField
              name="name"
              value={update.name}
              onChange={handleChange}
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                // overall height
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "#FAFAFA",

                  // default border
                  "& fieldset": {
                    borderColor: "#1A1A1A",
                    borderWidth: "0.2px",
                  },

                  // focused
                  "&.Mui-focused fieldset": {
                    borderColor: "#1A1A1A",
                    borderWidth: "0.2px",
                  },
                },

                // input text
                "& input": {
                  padding: "10px 12px",
                  fontSize: 14,
                },
              }}
            />
          </div>

          <div>
            <Typography fontWeight={400} fontSize={18} color="#1A1A1A">
              Email Address
            </Typography>
            <TextField
              name="email"
              value={update.email}
              onChange={handleChange}
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                // overall height
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "#FAFAFA",

                  // default border
                  "& fieldset": {
                    borderColor: "#1A1A1A",
                    borderWidth: "0.2px",
                  },

                  // focused
                  "&.Mui-focused fieldset": {
                    borderColor: "#1A1A1A",
                    borderWidth: "0.2px",
                  },
                },

                // input text
                "& input": {
                  padding: "10px 12px",
                  fontSize: 14,
                },
              }}
            />
          </div>

          <div>
            <Typography fontWeight={400} fontSize={18} color="#1A1A1A">
              Phone Number
            </Typography>
            <TextField
              name="phone"
              value={update.phone}
              onChange={handleChange}
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                // overall height
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "#FAFAFA",

                  // default border
                  "& fieldset": {
                    borderColor: "#1A1A1A",
                    borderWidth: "0.2px",
                  },

                  // focused
                  "&.Mui-focused fieldset": {
                    borderColor: "#1A1A1A",
                    borderWidth: "0.2px",
                  },
                },

                // input text
                "& input": {
                  padding: "10px 12px",
                  fontSize: 14,
                },
              }}
            />
          </div>

          <div>
            <Typography fontWeight={400} fontSize={18} color="#1A1A1A">
              Role
            </Typography>
            <TextField
              disabled
              value={user?.role || "admin"}
              //   onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g Important Platform Update"
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                // overall height
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "#FAFAFA",

                  // default border
                  "& fieldset": {
                    borderColor: "#1A1A1A",
                    borderWidth: "0.2px",
                  },

                  // focused
                  "&.Mui-focused fieldset": {
                    borderColor: "#1A1A1A",
                    borderWidth: "0.2px",
                  },
                },

                // input text
                "& input": {
                  padding: "10px 12px",
                  fontSize: 14,
                },
              }}
            />
          </div>

          <div className="flex gap-4 mt-12">
            <Button
              disabled={loading}
              onClick={submit}
              sx={{
                width: "365px",
                height: "48px",
                padding: "12px",
                borderRadius: "12px",
                backgroundColor: "#00C281",
                color: "white",
              }}
            >
              <Typography
                fontWeight={400}
                fontSize={16}
                sx={{ textTransform: "capitalize" }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  "Save Changes"
                )}
              </Typography>
            </Button>

            <Button
              onClick={() => {
                setOpen(false);
                setUpdate({
                  name: user?.name,
                  email: user?.email,
                  phone: user?.phone,
                });
              }}
              variant="outlined"
              sx={{
                width: "365px",
                height: "48px",
                padding: "12px",
                borderRadius: "12px",
                borderColor: "#1A1A1A80",
                color: "#1A1A1A",
              }}
            >
              <Typography
                fontWeight={400}
                fontSize={16}
                sx={{ textTransform: "capitalize" }}
              >
                Cancel
              </Typography>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Edit_Profile;
