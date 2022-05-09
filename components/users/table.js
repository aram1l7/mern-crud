import React, { useEffect, useState } from "react";
import {
  Table,
  Box,
  Button,
  Snackbar,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Alert,
  Paper,
  Input,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  selectTableCell: {
    width: 60,
  },
  tableCell: {
    minWidth: 130,
    height: 40,
  },
  input: {
    minWidth: 130,
    height: 40,
  },
  container: {
    display: "flex",
  },
  snackbar: {
    position: "relative",
    display: "block",
  },
  snackbarItem: {
    position: "absolute",
    top: "0",
    right: "10px",
    maxWidth: "320px",
  },
  search: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
}));

function UsersTable(props) {
  const [rows, setRows] = useState(props.users.users);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertText, setAlertText] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [disable, setDisable] = useState(true);
  const [editId, setEditId] = useState(null);
  const [isCreateEnabled, setIsCreateEnabled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const [editData, setEditData] = useState({});
  const [newRowData, setNewRowData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    setIsCreateEnabled(
      Object.values(newRowData).every((el) => el.length > 0) &&
        Object.keys(newRowData).length > 4
    );
  }, [newRowData]);

  const [addMode, setAddMode] = useState(false);
  const handleCreate = () => {
    axios
      .post("http://localhost:3000/api/users/create", newRowData)
      .then((res) => {
        const { user } = res.data;
        user.id = user._id;
        delete user._id;
        setRows([...rows, user]);
        setOpen(true);
        setAlertType("success");
        setAlertText("User was successfully added!");
      })
      .catch((err) => {
        setOpen(true);
        setAlertType("error");
        setAlertText(err.response.data?.errors[0]?.msg);
      });
    setAddMode(false);
    setNewRowData({});
  };

  const handleEdit = (id) => {
    setEdit(!isEdit);
    setEditId(id);
  };

  const keys = rows.slice(0, 1).map((el) => Object.keys(el))[0];

  const handleSave = (id) => {
    axios
      .put(`http://localhost:3000/api/users/edit/${id}`, editData)
      .then((res) => {
        setEdit(false);
        setEditId(null);
        setEditData({});
        let usersData = res.data.users.map((el) => {
          el.id = el._id;
          delete el._id;
          return el;
        });
        setRows(usersData);
        setOpen(true);
        setAlertText("User info was sucessfully updated!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputChange = (e, index) => {
    setDisable(false);
    const { name, value } = e.target;
    const editTarget = rows.filter((el) => el.id === index)[0];

    setEditData({
      ...editTarget,
      [name]: value,
    });
  };
  const handleChange = (e) => {
    setDisable(false);
    const { name, value } = e.target;
    setNewRowData({
      ...newRowData,
      [name]: value,
    });
  };
  const handleRemoveClick = async (i) => {
    await axios.delete(`http://localhost:3000/api/users/delete/${i}`);
    const list = rows.filter((el) => el.id !== i);
    setRows(list);
    setOpen(true);
    setAlertText("User was successfully deleted");
  };
  const classes = useStyles();

  return (
    <>
      <Snackbar
        autoHideDuration={3000}
        className={classes.snackbar}
        open={open}
        onClose={handleClose}
      >
        <Alert
          className={classes.snackbarItem}
          onClose={handleClose}
          severity={alertType}
        >
          {alertText}
        </Alert>
      </Snackbar>
      <Box margin={1}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={() => setAddMode(true)}>
            <AddBoxIcon onClick={() => setAddMode(true)} />
            ADD
          </Button>
          <div className={classes.search}>
            <SearchIcon />
            <Input
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        <Paper
          style={{ overflow: "auto", marginTop: "3rem", maxHeight: "500px" }}
        >
          <Table stickyHeader className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Surname</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .filter((el) => {
                  return keys.some((key) => {
                    return el[key]
                      .toString()
                      .toLowerCase()
                      .includes(searchValue.toLowerCase());
                  });
                })
                .map((row, i) => {
                  return (
                    <TableRow key={row.id}>
                      {isEdit && editId === row.id ? (
                        <>
                          <TableCell className={classes.selectTableCell}>
                            <Input
                              className={classes.input}
                              defaultValue={row.name}
                              name="name"
                              size="normal"
                              variant="standard"
                              onChange={(e) => handleInputChange(e, row.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              defaultValue={row.surname}
                              className={classes.input}
                              name="surname"
                              variant="standard"
                              onChange={(e) => handleInputChange(e, row.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="email"
                              className={classes.input}
                              defaultValue={row.email}
                              name="email"
                              variant="standard"
                              onChange={(e) => handleInputChange(e, row.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              defaultValue={row.phone}
                              name="phone"
                              className={classes.input}
                              variant="standard"
                              onChange={(e) => handleInputChange(e, row.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              className={classes.input}
                              variant="standard"
                              defaultValue={row.address}
                              name="address"
                              onChange={(e) => handleInputChange(e, row.id)}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <div className={classes.container}>
                              {rows.length !== 0 && (
                                <div>
                                  <Button
                                    disabled={disable}
                                    align="right"
                                    onClick={() => handleSave(editId)}
                                  >
                                    <DoneIcon />
                                  </Button>
                                </div>
                              )}
                              <Button
                                color="error"
                                onClick={() => {
                                  setEdit(false);
                                  setEditId(null);
                                }}
                              >
                                <CancelIcon />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.surname}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.email}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.phone}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.address}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <Button
                              align="right"
                              onClick={() => handleEdit(row.id)}
                              size="small"
                            >
                              <CreateIcon />
                            </Button>
                            <Button className="mr10">
                              <DeleteIcon
                                color="error"
                                onClick={() => handleRemoveClick(row.id)}
                              />
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}

              {addMode && (
                <TableRow>
                  <>
                    <TableCell className={classes.selectTableCell}>
                      <Input
                        className={classes.input}
                        value={newRowData.name}
                        name="name"
                        size="normal"
                        variant="standard"
                        onChange={(e) => handleChange(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={newRowData.surname}
                        className={classes.input}
                        name="surname"
                        variant="standard"
                        onChange={(e) => handleChange(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="email"
                        className={classes.input}
                        value={newRowData.email}
                        name="email"
                        variant="standard"
                        onChange={(e) => handleChange(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={newRowData.phone}
                        name="phone"
                        className={classes.input}
                        variant="standard"
                        onChange={(e) => handleChange(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className={classes.input}
                        variant="standard"
                        value={newRowData.address}
                        name="address"
                        onChange={(e) => handleChange(e)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <div className={classes.container}>
                        <div>
                          <Button
                            disabled={!isCreateEnabled}
                            align="right"
                            onClick={() => handleCreate()}
                          >
                            <DoneIcon />
                          </Button>
                        </div>
                        <Button
                          color="error"
                          onClick={() => {
                            setAddMode(false);
                            setNewRowData({});
                          }}
                        >
                          <CancelIcon />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </>
  );
}

export default UsersTable;
