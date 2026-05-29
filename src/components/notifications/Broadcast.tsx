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
import { IoNotificationsOutline } from "react-icons/io5";
import api from "../../utils/axiosInstance";
import { useToast } from "../../utils/useToast";
import Toast from "../../utils/Toast";

const Broadcast = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audience, setAudience] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const { toast, showToast, closeToast } = useToast();

  const submit = async () => {
    setLoading(true);

    try {
      const response = await api.post("/api/admin/bulk-email", {
        audience,
        subject,
        message,
      });

      setLoading(false);

      console.log(response.data);

      showToast("Emails sent successfully", "success");

      setTimeout(() => {
        setOpen(false);
      }, 2000);
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
    <div className="mr-5 mb-6">
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />

      <Button
        onClick={() => setOpen(true)}
        sx={{
          width: "190px",
          height: "48px",
          paddingY: "8px",
          //paddingX: "12px",
          borderRadius: "12px",
          backgroundColor: "#00C281",
          color: "white",
        }}
      >
        <span className="mr-2.5">
          <IoNotificationsOutline size={20} />
        </span>

        <Typography
          fontWeight={400}
          fontSize={16}
          sx={{ textTransform: "capitalize" }}
        >
          Broadcast Message
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
              Broadcast Message
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
              Recipients
            </Typography>
            <TextField
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g Green valley collection center"
              variant="outlined"
              size="small"
              fullWidth
              select
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
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="collectors">Collectors</MenuItem>
              <MenuItem value="centers">Centers</MenuItem>
              <MenuItem value="admins">Admins</MenuItem>
            </TextField>
          </div>

          <div>
            <Typography fontWeight={400} fontSize={18} color="#1A1A1A">
              Subject
            </Typography>
            <TextField
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
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

          <div>
            <Typography fontWeight={400} fontSize={18} color="#1A1A1A">
              Message
            </Typography>
            <TextField
              //rows={}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                // overall height
                "& .MuiOutlinedInput-root": {
                  height: "186px",
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
              This message will be sent to all selected recipients via email and
              in-app notification
            </Typography>
          </div>

          <div className="flex gap-4 mt-12">
            <Button
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
                  "Send Broadcast"
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

export default Broadcast;
