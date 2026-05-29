import {
  Dialog,
  DialogContent,
  MenuItem,
  DialogActions,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import api from "../../utils/axiosInstance";

type DownloadModalProps = {
  open: boolean;
  onClose: () => void;
};

export const DownloadModal = ({ open, onClose }: DownloadModalProps) => {
  const [dataset, setDataset] = useState("centers");
  const [format, setFormat] = useState("csv");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        dataset,
        format,
      });

      const response = await api.get(
        `/api/admin/download-report?${params.toString()}`,
        {
          responseType: "blob",
        },
      );

      const blob = response.data;

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${dataset}.${format === "excel" ? "xlsx" : format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to download file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <div className="flex justify-center py-5">
        <Typography fontSize={26} fontWeight={400} color="#1A1A1A">
          {`Download Report for ${dataset}`}
        </Typography>
      </div>

      <DialogContent
        sx={{
          width: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <TextField
          select
          label="Dataset"
          value={dataset}
          onChange={(e) => setDataset(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "40px",
              borderRadius: "12px",
              backgroundColor: "#00C2810D",

              "& fieldset": {
                borderColor: "#00C2810D",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#00C2810D",
              },
            },

            "& .MuiSelect-select": {
              padding: "10px 12px",
              fontSize: 14,
            },
          }}
        >
          <MenuItem value="centers">Centers</MenuItem>
          <MenuItem value="collectors">Collectors</MenuItem>
          <MenuItem value="drop offs">Drop offs</MenuItem>
        </TextField>

        <TextField
          select
          label="Format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "40px",
              borderRadius: "12px",
              backgroundColor: "#00C2810D",

              "& fieldset": {
                borderColor: "#00C2810D",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#00C2810D",
              },
            },

            "& .MuiSelect-select": {
              padding: "10px 12px",
              fontSize: 14,
            },
          }}
        >
          <MenuItem value="csv">CSV</MenuItem>
          <MenuItem value="excel">Excel</MenuItem>
          <MenuItem value="geojson">GeoJSON</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
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

        <Button
          variant="outlined"
          onClick={handleDownload}
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
              "Download"
            )}
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
