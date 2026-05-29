import {
  Typography,
  Dialog,
  DialogContent,
  Button,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useToast } from "../../utils/useToast";
import Toast from "../../utils/Toast";

type Partner = {
  _id: string;
  name: string;
  logo: { url: string };
};

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast, showToast, closeToast } = useToast();

  const fetchPartners = async () => {
    const res = await api.get("/api/partner");
    setPartners(res.data.data);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const addPartner = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (file) formData.append("logo", file);
      formData.append("name", name);

      const response = await api.post("/api/partner", formData);

      if (response.data.status === 201) {
        setLoading(false);
        setTimeout(() => {
          fetchPartners();
          setOpen(false);
        }, 2000);
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

  const removePartner = async (id: string) => {
    try {
      const response = await api.delete(`/api/partner/${id}`);

      if (response.data.status === 201) {
        setLoading(false);
        setTimeout(() => {
          fetchPartners();
        }, 2000);
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message;
      console.log(errMsg);

      showToast(errMsg, "error");

      if (errMsg) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Typography variant="h5">Partners</Typography>
        <Button
          fullWidth
          onClick={() => setOpen(true)}
          startIcon={<IoMdAdd />}
          sx={{
            width: "15%",
            backgroundColor: "#00C281",
            color: "white",
            textTransform: "capitalize",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <Typography fontSize={16} fontWeight={300} color="#FAFAFA">
            Add Parnter
          </Typography>
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-4">
        {partners.map((p) => (
          <div key={p._id} className="relative group cursor-pointer">
            <img src={p.logo.url} className="h-28 object-fit rounded" />

            <Typography>{p.name}</Typography>

            <button
              onClick={() => removePartner(p._id)}
              className="absolute top-2 right-2 hidden group-hover:block bg-red-500 text-white p-1 rounded "
            >
              <MdDelete />
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setFile(null);
          setName("");
        }}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            paddingY: { xs: "16px", sm: "20px", md: "24px" },
            paddingX: { xs: "12px", sm: "16px", md: "18px" },
            borderRadius: "16px",
            width: "100%",
            maxWidth: "900px",
            margin: "12px",
          },
        }}
      >
        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={closeToast}
        />
        <DialogTitle>New Partner</DialogTitle>
        <DialogContent className="flex flex-col gap-3">
          {file && (
            <div className="flex justify-center my-3">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-36 h-36 object-cover mt-2 rounded-xl"
              />
            </div>
          )}

          <input
            className="h-10 w-full rounded-xl bg-[#00C2810D] px-2.5 py-3 cursor-pointer"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0])
                setFile(e.target.files[0]);
            }}
          />

          <TextField
            placeholder="Partner Name"
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
            inputProps={{
              min: 0,
              max: 100,
              step: 1,
            }}
            size="small"
            fullWidth
            sx={{
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

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setOpen(false);
                setFile(null);
                setName("");
              }}
              sx={{
                textTransform: "capitalize",
                borderRadius: "10px",
                borderColor: "#1A1A1A80",
                color: "#1A1A1A",
                padding: "10px",
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              disabled={loading}
              onClick={addPartner}
              sx={{
                textTransform: "capitalize",
                borderRadius: "10px",
                backgroundColor: loading ? "#A0A0A0" : "#00C281",
                color: "white",
                padding: "10px",
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Add Parnter"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Partners;
