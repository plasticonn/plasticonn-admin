import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { useToast } from "../../utils/useToast";
import Toast from "../../utils/Toast";
import { BsBan } from "react-icons/bs";
import { MdSettingsBackupRestore } from "react-icons/md";
import api from "../../utils/axiosInstance";

interface Ban {
  action: string;
  user: string;
  _id: string;
  refresh: () => void;
}

const BanUser: React.FC<Ban> = ({ action, user, _id, refresh }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast, showToast, closeToast } = useToast();

  const submit = async () => {
    console.log(_id);
    setLoading(true);

    try {
      const status = action === "Ban" ? "suspended" : "active";

      const response = await api.put(`api/admin/${user}-mgt/status/${_id}`, {
        status,
      });

      if (response.data.status === 200) {
        showToast(response.data.message, "success");

        setTimeout(() => {
          setOpen(false);
          setLoading(false);
          refresh();
        }, 2000);
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

      <Tooltip title={action}>
        {action === "Ban" ? (
          <BsBan
            size={20}
            color="#E11D48"
            onClick={() => setOpen(true)}
            cursor="pointer"
          />
        ) : (
          <MdSettingsBackupRestore
            size={20}
            color="#00C281"
            onClick={() => setOpen(true)}
            cursor="pointer"
          />
        )}
      </Tooltip>

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
          <div className="flex flex-col gap-6.5">
            <div className="flex justify-center">
              {action === "Ban" ? (
                <BsBan size={50} color="#E11D48" />
              ) : (
                <MdSettingsBackupRestore size={50} color="#E11D48" />
              )}
            </div>

            <div className="flex justify-center text-center">
              <Typography
                fontSize={26}
                fontWeight={400}
                color="#1A1A1A"
              >{`Are you sure you want to ${action} this ${user}?`}</Typography>
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
                    "Confirm Action"
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BanUser;
