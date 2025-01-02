import React, {useEffect, useState} from "react";
import {
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    Tooltip,
    IconButton,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Alert,
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import api from "../api";

function Users() {
    const [users, setUsers] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await api.get("/users/");
                if (response.status !== 200) {
                    console.log("Error API response", response.statusText)
                }
                setUsers(response.data)
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUsers();
    }, []);

    const handleDeleteClick = (userId) => {
        setCurrentUserId(userId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/users/${currentUserId}`);
            setUsers((prev) => prev.filter((user) => user.id !== currentUserId));
            setSnackbarMessage("The user was successfully deleted.");
        } catch (error) {
            console.error("Error deleting user:", error);
            setSnackbarMessage("Failed to delete the user. Try again.");
        } finally {
            setOpenSnackbar(true);
            setOpenDialog(false);
        }
    };

    const handleEditClick = (userId) => {
        navigate(`/user/${userId}`);
    };

    return (
        <Box sx={{p: 4}}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Users
                </Typography>

                <Tooltip title="Create a new user">
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        component={Link}
                        to="/user/new"
                        sx={{mb: 2}}
                    >
                        New user
                    </Button>
                </Tooltip>
            </Box>
            <List>
                {users.map((user) => (
                    <ListItem
                        key={user.id}
                        sx={{
                            "&:hover": {backgroundColor: "rgba(0, 0, 0, 0.08)"},
                            display: "flex",
                            cursor: "pointer",
                        }}
                        onClick={() => handleEditClick(user.id)}
                        secondaryAction={
                            <>
                                <IconButton edge="end"
                                            aria-label="delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(user.id);
                                            }}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </>
                        }
                    >
                        <ListItemText primary={user.username}
                                      secondary={user.role}/>
                    </ListItem>
                ))}
            </List>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Delete user</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Users;
