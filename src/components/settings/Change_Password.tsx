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
import { useToast } from "../../utils/useToast";
import api from "../../utils/axiosInstance";
import Toast from "../../utils/Toast";

const Change_Password = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const { toast, showToast, closeToast } = useToast();

  const [passwordReset, setPasswordReset] = useState({
    curPassword: "",
    newPassword: "",
    confirmNewpassword: "",
    otp: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPasswordReset((prev) => ({ ...prev, [name]: value }));
  };

  const updatePassword = async () => {
    try {
      if (!passwordReset.curPassword) {
        showToast("Please provide current password", "warning");
        return;
      }

      const response = await api.post("/api/admin/update-password", {
        curPassword: passwordReset.curPassword,
      });

      setLoading(false);

      if (response.data.status === 200) {
        setUpdate(true);

        showToast("OTP sent to mail", "success");
      }
    } catch (error: any) {
      const errMsg = error?.response?.data?.message;

      showToast(errMsg, "error");

      if (errMsg) {
        setLoading(false);
      }
    }
  };

  const verifyupdatePassword = async () => {
    console.log(passwordReset);
    try {
      const response = await api.put("/api/admin/verify-password-update", {
        newPassword: passwordReset.newPassword,
        otp: passwordReset.otp,
      });

      setLoading(false);

      if (response.data.status === 200) {
        showToast("Password changed successfully", "success");

        setTimeout(() => {
          setOpen(false);
          setUpdate(false);
        }, 2000);

        setPasswordReset({
          newPassword: "",
          curPassword: "",
          confirmNewpassword: "",
          otp: "",
        });
      }
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
        variant="outlined"
        sx={{
          width: "161px",
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
          Change Password
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
          <div className="flex justify-between items-center mb-5">
            <Typography fontWeight={400} fontSize={26} color="#1A1A1A">
              Change Password
            </Typography>

            <IoCloseOutline
              onClick={() => setOpen(false)}
              size={20}
              color="#1A1A1A"
              style={{ cursor: "pointer" }}
            />
          </div>

          <div>
            <Typography fontWeight={400} fontSize={18} color="#1A1A1A">
              Current Password
            </Typography>
            <TextField
              name="curPassword"
              value={passwordReset.curPassword}
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

          {update && (
            <>
              <div>
                <Typography fontWeight={400} fontSize={18} color="#1A1A1A">
                  New Password
                </Typography>
                <TextField
                  name="newPassword"
                  value={passwordReset.newPassword}
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
                  Confirm New Password
                </Typography>
                <TextField
                  name="confirmNewPassword"
                  value={passwordReset.confirmNewpassword}
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
                  OTP
                </Typography>
                <TextField
                  placeholder="Input OTP here"
                  name="otp"
                  value={passwordReset.otp}
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

              <div className=" bg-[#355AD61A] p-3 rounded-xl border-0.5 border-[#355AD680] mt-2">
                <Typography
                  fontWeight={400}
                  fontSize={16}
                  color="#355AD6"
                  fontStyle="italic"
                >
                  Password must be at least 8 characters long and include
                  letters and numbers.
                </Typography>
              </div>
            </>
          )}

          <div className="flex gap-4 mt-12">
            <Button
              disabled={loading}
              onClick={update ? verifyupdatePassword : updatePassword}
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
                {update ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  "Send OTP"
                )}
              </Typography>
            </Button>

            <Button
              onClick={() => {
                setOpen(false);
                setUpdate(false);
                setPasswordReset({
                  newPassword: "",
                  curPassword: "",
                  confirmNewpassword: "",
                  otp: "",
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

export default Change_Password;
