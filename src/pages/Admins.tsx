import {
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BsBan } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import Pages from "../container/Pages";
import Add_Admin from "../components/admins/Add_Admin";
import api from "../utils/axiosInstance";
import BanUser from "../components/modals/BanUser";
import DeleteUser from "../components/modals/DeleteUser";

interface Admins {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

const Admins = () => {
  const [search, setSearch] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const [admins, setAdmins] = useState<Admins[]>([]);

  const adminList = async () => {
    try {
      const response = await api.get("/api/admin/admin-mgt/list");

      setAdmins(response.data.data.admins);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    adminList();
  }, []);

  const head = ["Name", "Email", "Role", "Status", "Actions"];

  console.log(admins);

  // const rows = [
  //   {
  //     name: "John Doe",
  //     email: "johndoe@gmail.com",
  //     role: "Super Admin",
  //     status: "suspended",
  //     last_login: "22, ogundola street",
  //   },
  //   {
  //     name: "Jane Doe",
  //     email: "janedoe@gmail.com",
  //     role: "Admin",
  //     status: "active",
  //     last_login: "22, ogundola street",
  //   },
  //   {
  //     name: "Job Doe",
  //     email: "jondoe@gmail.com",
  //     role: "Admin",
  //     status: "active",
  //     last_login: "22, ogundola street",
  //   },
  // ];

  const filteredRows = admins.filter((row) => {
    const query = search.toLowerCase();

    const matchesSearch =
      (row.firstName ?? "").toLowerCase().includes(query) ||
      (row.lastName ?? "").toLowerCase().includes(query) ||
      (row.email ?? "").toLowerCase().includes(query);

    return matchesSearch;
  });

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Pages
      page="Admins"
      helperText="Manage admin settings and access controls."
    >
      <div className="px-5 mt-6">
        <div className="flex gap-15">
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoSearchOutline color="#1A1A1AB2" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 1019,

              // overall height
              "& .MuiOutlinedInput-root": {
                height: 50,
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

          <div className="flex justify-end">
            <Add_Admin onSuccess={adminList} />
          </div>
        </div>

        <div className="mt-6">
          <TableContainer
            sx={{
              maxHeight: 500,
              overflowY: "auto",
              borderRadius: "18px",
              borderWidth: "0.5px",
              borderColor: "#1A1A1ACC",
            }}
          >
            <Table
              stickyHeader
              sx={{
                minWidth: 650,
                backgroundColor: "#FAFAFA",
              }}
            >
              <TableHead sx={{ backgroundColor: "#EAF5F2" }}>
                <TableRow>
                  {head.map((item) => (
                    <TableCell
                      key={item}
                      sx={{
                        py: 3,
                        px: 4,
                        backgroundColor: "#EAF5F2",
                      }}
                    >
                      <Typography
                        fontWeight={700}
                        fontSize={18}
                        color="#1A1A1AB2"
                      >
                        {item}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRows.length ? (
                  paginatedRows.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{
                        fontWeight: 400,
                        fontSize: 18,
                        color: "#1A1A1A",
                        backgroundColor: "#FAFAFA",
                      }}
                    >
                      <TableCell sx={{ px: 4 }}>
                        {row.firstName} {row.lastName}
                      </TableCell>

                      <TableCell sx={{ px: 4 }}>
                        <Typography
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 2,
                            py: 0.5,
                            borderRadius: "999px",
                            fontSize: 14,
                            fontWeight: 500,

                            //   backgroundColor:
                            //     TYPE_STYLES[row.type]?.bg ?? "#F3F4F6",
                            //   color: TYPE_STYLES[row.type]?.color ?? "#374151",
                          }}
                        >
                          {row.email}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ px: 4 }}>
                        <Typography sx={{ textTransform: "capitalize" }}>
                          {row.role || "admin"}
                        </Typography>
                      </TableCell>

                      {/* <TableCell sx={{ px: 4 }}>
                        <Typography sx={{ textTransform: "capitalize" }}>
                          {row.last_login}
                        </Typography>
                      </TableCell> */}

                      <TableCell sx={{ px: 4 }}>
                        <Typography
                          display="flex"
                          sx={{ textTransform: "capitalize" }}
                          color={
                            row.status === "active" ? "#00C281" : "#E11D48"
                          }
                        >
                          <span className="mr-3">
                            {row.status === "active" ? (
                              <img src="/active.png" alt="active" />
                            ) : (
                              <BsBan size={20} color="#E11D48" />
                            )}
                          </span>{" "}
                          {row.status}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ px: 4 }}>
                        <div className="flex gap-6">
                          <BanUser
                            action={row.status === "active" ? "Ban" : "Unban"}
                            user="admin"
                            _id={row._id}
                            refresh={adminList}
                          />
                          <DeleteUser
                            user="admin"
                            _id={row._id}
                            refresh={adminList}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </Pages>
  );
};

export default Admins;
