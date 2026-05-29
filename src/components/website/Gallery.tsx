import {
  Typography,
  Button,
  Dialog,
  DialogContent,
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

type Gallery = {
  _id: string;
  image: { url: string };
  event: string;
};

const Gallery = () => {
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [event, setEvent] = useState("");
  // const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { toast, showToast, closeToast } = useToast();

  const fetchGallery = async () => {
    const res = await api.get("/api/gallery");
    setGallery(res.data.data);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const uploadGallery = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      photos.forEach((photo) => {
        formData.append("images", photo);
      });

      formData.append("event", event);

      const response = await api.post("/api/gallery", formData);

      if (response.data.status === 201) {
        setLoading(false);
        setTimeout(() => {
          fetchGallery();
          setOpen(false);
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

  const deletePhoto = async (id: string) => {
    try {
      const response = await api.delete(`/api/gallery/${id}`);

      if (response.data.status === 201) {
        setLoading(false);
        setTimeout(() => {
          fetchGallery();
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

  const grouped = gallery.reduce((acc: any, item) => {
    acc[item.event] = acc[item.event] || [];
    acc[item.event].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Typography variant="h5">Gallery</Typography>
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
            Add Photos
          </Typography>
        </Button>
      </div>

      <div className="max-h-100 overflow-y-auto">
        {Object.keys(grouped).map((eventName) => (
          <div key={eventName} className="mt-6">
            <Typography variant="h6">{eventName}</Typography>

            <div className="grid grid-cols-4 gap-3">
              {grouped[eventName].map((photo: Gallery) => (
                <div key={photo._id} className="relative group">
                  <img
                    src={photo.image.url}
                    className="rounded-lg w-full h-32 object-cover"
                  />

                  <button
                    onClick={() => deletePhoto(photo._id)}
                    className="absolute top-2 right-2 hidden group-hover:block bg-red-500 text-white p-1 rounded"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Upload Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
        <DialogTitle>Add Photos</DialogTitle>
        <DialogContent className="flex flex-col gap-3">
          <TextField
            placeholder="Event name"
            onChange={(e) => setEvent(e.target.value)}
            type="text"
            name="event"
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

          <div>
            <Typography
              fontWeight={400}
              fontSize={{ xs: 15, sm: 16, md: 18 }}
              color="#1A1A1A"
            >
              Photos
            </Typography>

            <input
              className="h-10 w-full rounded-xl bg-[#00C2810D] px-2.5 py-3 cursor-pointer"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files)
                  setPhotos((prev) => [
                    ...prev,
                    ...Array.from(e.target.files || []),
                  ]);
              }}
            />

            {photos.length > 0 && (
              <div className="mt-4 flex flex-col gap-3">
                <Typography fontSize={16} fontWeight={400} color="#1A1A1A">
                  Selected photos
                </Typography>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {photos.map((file, index) => (
                    <div
                      key={index}
                      className="relative rounded-xl border border-[#1A1A1A20] p-2 flex flex-col items-center gap-2"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Typography
                        fontSize={12}
                        className="truncate w-full text-center"
                      >
                        {file.name}
                      </Typography>
                      <button
                        onClick={() =>
                          setPhotos((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setOpen(false)}
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
              onClick={uploadGallery}
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
                "Add Photos"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
