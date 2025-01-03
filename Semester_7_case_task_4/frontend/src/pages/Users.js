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
    DialogTitle, Alert, CircularProgress,
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import api from "../api";
import styles from "../styles/HomePageStyles";

function Users() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await api.get("/users/");
                setUsers(response.data)
            } catch (error) {
                console.error("Error fetching users:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
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

    if (isLoading) {
        return (
            <Box sx={styles.container}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={styles.container}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={styles.container}>
            <Box sx={styles.surveysSection}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 4,
                    }}
                >
                    <Typography variant="h5" gutterBottom>
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
            </Box>
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
