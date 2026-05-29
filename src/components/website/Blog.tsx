import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline, MdAdd } from "react-icons/md";
import { useToast } from "../../utils/useToast";
import Toast from "../../utils/Toast";
import DayAndTime from "../../utils/DayAndTime";

// ── types ──────────────────────────────────────────────────────────────────

type ContentBlock = {
  type: "paragraph" | "heading" | "blockquote";
  text: string;
};

type Tag = {
  label: string;
  color: string;
  bg: string;
};

type Blog = {
  id: string;
  title: string;
  subtitle?: string;
  author: { name: string; role: string; bio: string; initials: string };
  status: "draft" | "published";
  content: ContentBlock[];
  tags: Tag[];
  image?: string;
  imageCaption?: string;
  readTime?: string;
  views?: string;
  publishedAt?: string;
  createdAt: string;
};

type FormState = {
  title: string;
  subtitle: string;
  author: string;
  role: string;
  bio: string;
  imageCaption: string;
};

// ── tag color presets ──────────────────────────────────────────────────────

const TAG_PRESETS = [
  { label: "Sustainability", color: "#1D9E75", bg: "#E1F5EE" },
  { label: "Recycling", color: "#0F6E56", bg: "#9FE1CB33" },
  { label: "Environment", color: "#185FA5", bg: "#E6F1FB" },
  { label: "Community", color: "#BA7517", bg: "#FAEEDA" },
  { label: "News", color: "#993556", bg: "#FBEAF0" },
];

// ── shared text field sx ──────────────────────────────────────────────────

const fieldSx = (multiline = false) => ({
  "& .MuiOutlinedInput-root": {
    ...(!multiline ? { height: "40px" } : {}),
    borderRadius: "12px",
    backgroundColor: "#FAFAFA",
    "& fieldset": { borderColor: "#1A1A1A", borderWidth: "0.2px" },
    "&.Mui-focused fieldset": { borderColor: "#1A1A1A", borderWidth: "0.2px" },
  },
  "& input": { padding: "10px 12px", fontSize: 14 },
});

// ═══════════════════════════════════════════════════════════════════════════

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selected, setSelected] = useState<Blog | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const { toast, showToast, closeToast } = useToast();

  // ── form state ────────────────────────────────────────────────────────

  const [form, setForm] = useState<FormState>({
    title: "",
    subtitle: "",
    author: "",
    role: "",
    bio: "",
    imageCaption: "",
  });

  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { type: "paragraph", text: "" },
  ]);

  const [tags, setTags] = useState<Tag[]>([]);

  const setField =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // ── content block helpers ─────────────────────────────────────────────

  const addBlock = () =>
    setBlocks((prev) => [...prev, { type: "paragraph", text: "" }]);

  const removeBlock = (i: number) =>
    setBlocks((prev) => prev.filter((_, idx) => idx !== i));

  const updateBlock = (i: number, key: keyof ContentBlock, value: string) =>
    setBlocks((prev) =>
      prev.map((b, idx) => (idx === i ? { ...b, [key]: value } : b)),
    );

  // ── tag helpers ───────────────────────────────────────────────────────

  const toggleTag = (preset: Tag) => {
    setTags((prev) =>
      prev.find((t) => t.label === preset.label)
        ? prev.filter((t) => t.label !== preset.label)
        : [...prev, preset],
    );
  };

  // ── reset form ────────────────────────────────────────────────────────

  const resetForm = () => {
    setForm({
      title: "",
      subtitle: "",
      author: "",
      role: "",
      bio: "",
      imageCaption: "",
    });
    setBlocks([{ type: "paragraph", text: "" }]);
    setTags([]);
    setImage(null);
    setLoading(false);
  };

  // ── api calls ─────────────────────────────────────────────────────────

  const fetchBlogs = async () => {
    const res = await api.get("/api/blog");
    setBlogs(res.data.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const createBlog = async () => {
    try {
      setLoading(true);
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("content", JSON.stringify(blocks));
      fd.append("tags", JSON.stringify(tags));
      if (image) fd.append("image", image);

      const res = await api.post("/api/blog", fd);
      showToast(res.data.message ?? "Blog created", "success");
      setTimeout(() => {
        fetchBlogs();
        setCreateOpen(false);
        resetForm();
      }, 1500);
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ?? "Something went wrong",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const publishBlog = async (id: string) => {
    try {
      await api.patch(`/api/blog/${id}`);
      showToast("Blog published", "success");
      setTimeout(() => {
        fetchBlogs();
        setOpen(false);
      }, 1500);
    } catch (err: any) {
      showToast(err?.response?.data?.message, "error");
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/api/blog/${id}`);
      showToast("Blog deleted", "success");
      setTimeout(() => {
        fetchBlogs();
        setOpen(false);
      }, 1500);
    } catch (err: any) {
      showToast(err?.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  console.log(selected);

  // ── render ────────────────────────────────────────────────────────────

  return (
    <div className="p-4">
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />

      {/* header */}
      <div className="flex justify-between mb-4">
        <Typography variant="h5">Blogs</Typography>
        <Button
          onClick={() => setCreateOpen(true)}
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
            Add Blog
          </Typography>
        </Button>
      </div>

      {/* table */}
      <div className="max-h-125 overflow-y-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow
                key={blog.id}
                onClick={() => {
                  setSelected(blog);
                  setOpen(true);
                }}
                className="cursor-pointer"
              >
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.author?.name ?? blog.author}</TableCell>
                <TableCell>
                  <Chip
                    label={blog.status}
                    color={blog.status === "published" ? "success" : "warning"}
                  />
                </TableCell>
                <TableCell>
                  <DayAndTime date={blog.createdAt} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── DETAILS MODAL ─────────────────────────────────────────────── */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            paddingY: { xs: "16px", md: "24px" },
            paddingX: { xs: "12px", md: "18px" },
            borderRadius: "16px",
            maxWidth: "900px",
            margin: "12px",
          },
        }}
      >
        <DialogTitle>{selected?.title}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4">
            {/* image preview */}
            {selected?.image && (
              <img
                src={selected.image}
                alt="cover"
                className="w-full h-48 object-cover rounded-xl"
              />
            )}

            <TextField
              label="Author"
              value={selected?.author?.name ?? ""}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={fieldSx()}
            />
            <TextField
              label="Role"
              value={selected?.author?.role ?? ""}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={fieldSx()}
            />
            <TextField
              label="Subtitle"
              value={selected?.subtitle ?? ""}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={fieldSx()}
            />
            <TextField
              label="Status"
              value={selected?.status ?? ""}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={fieldSx()}
            />
            <TextField
              label="Read time"
              value={selected?.readTime ?? ""}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={fieldSx()}
            />

            {/* tags */}
            {selected?.tags?.length ? (
              <div className="flex gap-2 flex-wrap">
                {selected.tags.map((t) => (
                  <span
                    key={t.label}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      color: t.color,
                      background: t.bg,
                      border: `1px solid ${t.color}33`,
                    }}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            ) : null}

            {/* content blocks */}
            <div className="flex flex-col gap-3">
              <Typography fontSize={14} color="#6B7280">
                Content
              </Typography>
              {selected?.content?.map((block, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <Typography
                    fontSize={11}
                    color="#9CA3AF"
                    className="capitalize"
                  >
                    {block.type}
                  </Typography>
                  <div
                    className={`rounded-xl p-3 text-sm bg-[#FAFAFA] border border-[#1A1A1A22] leading-relaxed ${
                      block.type === "blockquote"
                        ? "border-l-4 border-l-[#1D9E75] italic text-gray-500 pl-4"
                        : block.type === "heading"
                          ? "font-semibold text-base"
                          : ""
                    }`}
                  >
                    {block.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {selected?.status === "draft" && (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => publishBlog(selected!.id)}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "10px",
                  borderColor: "#1A1A1A80",
                  color: "#1A1A1A",
                  padding: "10px",
                }}
              >
                Publish
              </Button>
            )}
            <Button
              fullWidth
              disabled={loading}
              onClick={() => deleteBlog(selected!.id)}
              sx={{
                textTransform: "capitalize",
                borderRadius: "10px",
                backgroundColor: loading ? "#A0A0A0" : "red",
                color: "white",
                padding: "10px",
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Delete blog"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── CREATE MODAL ──────────────────────────────────────────────── */}
      <Dialog
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          resetForm();
        }}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            paddingY: { xs: "16px", md: "24px" },
            paddingX: { xs: "12px", md: "18px" },
            borderRadius: "16px",
            maxWidth: "900px",
            margin: "12px",
          },
        }}
      >
        <DialogTitle>Create Blog</DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          {/* ── basic fields ── */}
          <TextField
            placeholder="Title"
            onChange={setField("title")}
            fullWidth
            size="small"
            sx={fieldSx()}
          />
          <TextField
            placeholder="Subtitle"
            onChange={setField("subtitle")}
            fullWidth
            size="small"
            sx={fieldSx()}
          />
          <TextField
            placeholder="Author"
            onChange={setField("author")}
            fullWidth
            size="small"
            sx={fieldSx()}
          />
          <TextField
            placeholder="Role (e.g. Environmental Correspondent)"
            onChange={setField("role")}
            fullWidth
            size="small"
            sx={fieldSx()}
          />
          <TextField
            placeholder="Author bio"
            onChange={setField("bio")}
            fullWidth
            multiline
            rows={2}
            sx={fieldSx(true)}
          />

          {/* ── tags ── */}
          <div>
            <Typography fontSize={14} color="#6B7280" mb={1}>
              Tags (pick any)
            </Typography>
            <div className="flex gap-2 flex-wrap">
              {TAG_PRESETS.map((preset) => {
                const active = tags.some((t) => t.label === preset.label);
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => toggleTag(preset)}
                    className="text-xs px-3 py-1 rounded-full font-medium transition-all cursor-pointer"
                    style={{
                      color: active ? preset.color : "#6B7280",
                      background: active ? preset.bg : "#F3F4F6",
                      border: `1px solid ${active ? preset.color + "55" : "#E5E7EB"}`,
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── content blocks ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Typography fontSize={14} color="#6B7280">
                Content blocks
              </Typography>
              <button
                type="button"
                onClick={addBlock}
                className="flex items-center gap-1 text-xs text-[#00C281] border border-[#00C28133] rounded-lg px-2 py-1 hover:bg-[#00C2810D] transition-all"
              >
                <MdAdd size={14} /> Add block
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {blocks.map((block, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex flex-col gap-2 flex-1">
                    {/* type selector */}
                    <FormControl size="small" fullWidth>
                      <Select
                        value={block.type}
                        onChange={(e) => updateBlock(i, "type", e.target.value)}
                        sx={{
                          borderRadius: "12px",
                          backgroundColor: "#FAFAFA",
                          fontSize: 13,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1A1A1A",
                            borderWidth: "0.2px",
                          },
                        }}
                      >
                        <MenuItem value="paragraph">Paragraph</MenuItem>
                        <MenuItem value="heading">Heading</MenuItem>
                        <MenuItem value="blockquote">Blockquote</MenuItem>
                      </Select>
                    </FormControl>

                    {/* text input */}
                    <TextField
                      placeholder={
                        block.type === "heading"
                          ? "Enter heading text..."
                          : block.type === "blockquote"
                            ? "Enter quote text..."
                            : "Enter paragraph text..."
                      }
                      value={block.text}
                      onChange={(e) => updateBlock(i, "text", e.target.value)}
                      fullWidth
                      multiline
                      rows={block.type === "paragraph" ? 3 : 2}
                      sx={{
                        ...fieldSx(true),
                        ...(block.type === "blockquote"
                          ? {
                              "& .MuiOutlinedInput-root": {
                                borderLeft: "3px solid #1D9E75",
                                borderRadius: "0 12px 12px 0",
                                backgroundColor: "#FAFAFA",
                                "& fieldset": {
                                  borderColor: "#1A1A1A",
                                  borderWidth: "0.2px",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#1A1A1A",
                                  borderWidth: "0.2px",
                                },
                                fontStyle: "italic",
                              },
                            }
                          : {}),
                      }}
                    />
                  </div>

                  {/* remove block */}
                  {blocks.length > 1 && (
                    <IconButton
                      onClick={() => removeBlock(i)}
                      size="small"
                      sx={{ mt: "36px", color: "#EF4444" }}
                    >
                      <MdDeleteOutline size={18} />
                    </IconButton>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── image ── */}
          <div>
            <Typography
              fontWeight={400}
              fontSize={{ xs: 15, md: 18 }}
              color="#1A1A1A"
              mb={1}
            >
              Cover image
            </Typography>
            {image && (
              <div className="flex justify-center my-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full h-44 object-cover rounded-xl"
                />
              </div>
            )}
            <input
              className="h-10 w-full rounded-xl bg-[#00C2810D] px-2.5 py-3 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setImage(e.target.files[0]);
              }}
            />
            <TextField
              placeholder="Image caption (optional)"
              onChange={setField("imageCaption")}
              fullWidth
              size="small"
              sx={{ ...fieldSx(), mt: 1.5 }}
            />
          </div>

          {/* ── actions ── */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setCreateOpen(false);
                resetForm();
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
              onClick={createBlog}
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
                "Add blog"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Blog;
