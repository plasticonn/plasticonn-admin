import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { RiUserAddLine } from "react-icons/ri";
import { useToast } from "../../utils/useToast";
import api from "../../utils/axiosInstance";
import Toast from "../../utils/Toast";

interface AdminDetails {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  address: string;
}

const Add_Admin = ({ onSuccess }: { onSuccess: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast, showToast, closeToast } = useToast();

  const [adminDetails, setAdminDetails] = useState<AdminDetails>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setAdminDetails((prev) => ({ ...prev, [name]: value }));
  };

  const isFormDataComplete = () => {
    return Object.values(adminDetails).every((value) => value.trim() !== "");
  };

  const submit = async () => {
    setLoading(true);
    const formReady = isFormDataComplete();

    if (!formReady) {
      setLoading(false);
      showToast("Please input all fields", "warning");
      return;
    }

    try {
      const response = await api.post("/api/admin/admin-mgt/add", adminDetails);

      if (response.data.status === 201) {
        setLoading(false);

        console.log(response.data);

        showToast(`${response.data.message}`, "success");

        setOpen(false);

        onSuccess();
      }
    } catch (error: any) {
      const errMsg = error?.response?.data?.message;
      console.log(errMsg);

      showToast(errMsg, "error");

      setLoading(false);

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
        startIcon={<RiUserAddLine />}
        onClick={() => setOpen(true)}
        variant="outlined"
        sx={{
          width: "200px",
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
          Add Admin
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
              Add Admin
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
              Last Name
            </Typography>
            <TextField
              name="lastName"
              value={adminDetails.lastName}
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
              First Name
            </Typography>
            <TextField
              name="firstName"
              value={adminDetails.firstName}
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
              Email
            </Typography>
            <TextField
              name="email"
              value={adminDetails.email}
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
              Address
            </Typography>
            <TextField
              name="address"
              value={adminDetails.address}
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
              select
              name="role"
              value={adminDetails.role}
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
            >
              <MenuItem value="super admin">Super Admin</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </div>

          <div className=" bg-[#355AD61A] p-3 rounded-xl border-0.5 border-[#355AD680] mt-2">
            <Typography
              fontWeight={400}
              fontSize={16}
              color="#355AD6"
              fontStyle="italic"
            >
              An email will be sent to the provided address with the invitation
              details, including a system-generated password that can be
              changed.
            </Typography>
          </div>

          <div className="flex gap-4 mt-12">
            <Button
              onClick={submit}
              disabled={loading}
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
                  "Add Admin"
                )}
              </Typography>
            </Button>

            <Button
              onClick={() => setOpen(false)}
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

export default Add_Admin;
