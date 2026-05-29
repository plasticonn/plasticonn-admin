import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useToast } from "../../utils/useToast";
import Toast from "../../utils/Toast";
import { useState } from "react";
import api from "../../utils/axiosInstance";
import { VscEyeClosed } from "react-icons/vsc";
import { VscEye } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);

  const { toast, showToast, closeToast } = useToast();

  const [passwordReset, setPasswordReset] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPasswordReset((prev) => ({ ...prev, [name]: value }));
  };

  const initiate = async () => {
    setLoading(true);

    try {
      const response = await api.post("/api/auth/forget-password", {
        email: passwordReset.email,
      });

      setLoading(false);

      if (response.data.status === 200) {
        setStep1(true);

        showToast("OTP sent to email provided", "success");
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

  const verify = async () => {
    setLoading(true);

    try {
      const response = await api.post("/api/auth/confirm-password-reset", {
        email: passwordReset.email,
        otp_code: passwordReset.otp,
      });

      setLoading(false);

      console.log(response.data);

      setStep2(true);
      setStep1(false);

      showToast("OTP verified", "success");
    } catch (error: any) {
      const errMsg = error?.response?.data?.message;
      console.log(errMsg);

      showToast(errMsg, "error");

      if (errMsg) {
        setLoading(false);
      }
    }
  };

  const reset = async () => {
    setLoading(true);

    try {
      const response = await api.post("/api/auth/reset-password", {
        email: passwordReset.email,
        otp_code: passwordReset.otp,
        password: passwordReset.password,
      });

      if (response.data.status === 200) {
        setLoading(false);

        showToast("Password reset successfully", "success", "/");
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
    <div className="flex justify-center bg-[#FAFAFA] pt-10 pb-0 h-full">
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />

      <div className="flex flex-col gap-5.25">
        <div className="flex flex-col gap-5.25">
          <div className="flex justify-center">
            <img src="/logo.png" />

            <Typography color="#005C3D" fontSize={36} fontWeight={400}>
              Plasticonn
            </Typography>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-col ">
              <div className="flex justify-center">
                <Typography color="#1A1A1A" fontSize={24} fontWeight={400}>
                  Reset Your Password
                </Typography>
              </div>

              <div className="flex justify-center">
                <Typography color="#1A1A1A99" fontSize={18} fontWeight={400}>
                  Enter your email address and follow the steps
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FAFAFA] rounded-[18px] border border-[#1A1A1A80] p-6 mt-4 ml-4 flex flex-col gap-6.5 w-228">
          <div className="flex justify-center">
            <div className="flex flex-col gap-4">
              <div className="flex justify-center">
                <Typography color="#1A1A1A" fontSize={24} fontWeight={400}>
                  Forgot Password
                </Typography>
              </div>

              <Typography color="#1A1A1A99" fontSize={20} fontWeight={400}>
                We'll help you get back into your account securely
              </Typography>
            </div>
          </div>

          <div className="mx-3">
            <Typography fontWeight={400} fontSize={18} color="#1A1A1A">
              Email
            </Typography>
            <TextField
              name="email"
              value={passwordReset.email}
              onChange={handleChange}
              placeholder="Enter your email associated to your plasticonn account"
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                // overall height
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "#00C2810D",

                  // default border
                  "& fieldset": {
                    borderColor: "#00C2810D",
                  },

                  // focused
                  "&.Mui-focused fieldset": {
                    borderColor: "#00C2810D",
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

          {step1 && (
            <div className="mx-3">
              <Typography fontWeight={400} fontSize={18} color="#1A1A1A">
                OTP
              </Typography>
              <TextField
                type="text"
                name="otp"
                value={passwordReset.otp}
                onChange={handleChange}
                placeholder="Enter the OTP sent to your mail"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  // overall height
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    borderRadius: "12px",
                    backgroundColor: "#00C2810D",

                    // default border
                    "& fieldset": {
                      borderColor: "#00C2810D",
                    },

                    // focused
                    "&.Mui-focused fieldset": {
                      borderColor: "#00C2810D",
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
          )}

          {step2 && (
            <div className="mx-3">
              <Typography fontWeight={400} fontSize={18} color="#1A1A1A">
                Password
              </Typography>
              <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                value={passwordReset.password}
                onChange={handleChange}
                placeholder="Enter your password"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  // overall height
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    borderRadius: "12px",
                    backgroundColor: "#00C2810D",

                    // default border
                    "& fieldset": {
                      borderColor: "#00C2810D",
                    },

                    // focused
                    "&.Mui-focused fieldset": {
                      borderColor: "#00C2810D",
                    },
                  },

                  // input text
                  "& input": {
                    padding: "10px 12px",
                    fontSize: 14,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {showPassword ? (
                        <VscEye
                          size={20}
                          className="text-[#A0AAB2] cursor-pointer"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <VscEyeClosed
                          size={20}
                          className="text-[#A0AAB2] cursor-pointer"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          )}

          <div
            className="mx-3 flex justify-center"
            onClick={() => navigate("/", { replace: true })}
          >
            <Typography
              fontWeight={400}
              fontSize={18}
              color="#00C281"
              sx={{
                "&:hover": { cursor: "pointer", textDecoration: "underline" },
              }}
            >
              I have remembered my password
            </Typography>
          </div>

          <Button
            disabled={loading}
            fullWidth
            onClick={step1 ? verify : step2 ? reset : initiate}
            sx={{
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
              {step1 ? (
                "Verify OTP"
              ) : step2 ? (
                "Reset Password"
              ) : loading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Send OTP"
              )}
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
