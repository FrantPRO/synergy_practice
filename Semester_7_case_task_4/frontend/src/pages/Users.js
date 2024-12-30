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
    DialogTitle,
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

function Users() {
    const [users, setUsers] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    // Mock users data
    useEffect(() => {
        const fakeUsers = [
            {
                id: 1,
                name: "John Smith",
                company: "Company 1",
                role: "Admin"
            },
            {
                id: 2,
                name: "Anna Carenina",
                company: "Company 1",
                role: "Manager"
            },
            {
                id: 3,
                name: "Sergey Brin",
                company: "Company 2",
                role: "Researcher"
            },
            {
                id: 4,
                name: "Maria Magdalena",
                company: "Company 2",
                role: "Admin"
            },
            {
                id: 5,
                name: "San Hose",
                company: "Company 3",
                role: "Manager"
            },
        ];
        setUsers(fakeUsers);
    }, []);

    const handleDeleteClick = (userId) => {
        setCurrentUserId(userId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmDelete = () => {
        setUsers((prev) => prev.filter((user) => user.id !== currentUserId));
        setSnackbarMessage("The user was successfully deleted.");
        setOpenSnackbar(true);
        setOpenDialog(false);
    };

    const handleEditClick = (userId) => {
        navigate(`/user/${userId}`);
    };

    // Group users by company
    const groupedUsers = users.reduce((acc, user) => {
        acc[user.company] = acc[user.company] || [];
        acc[user.company].push(user);
        return acc;
    }, {});

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

            {Object.entries(groupedUsers).map(([company, companyUsers]) => (
                <Box key={company} sx={{mb: 4}}>
                    <Typography variant="h6" gutterBottom>
                        {company}
                    </Typography>
                    <List>
                        {companyUsers.map((user) => (
                            <ListItem
                                key={user.id}
                                sx={{
                                    "&:hover": {backgroundColor: "rgba(0, 0, 0, 0.08)"},
                                    cursor: "pointer",
                                }}
                                onClick={() => handleEditClick(user.id)}
                                secondaryAction={
                                    <>
                                        <IconButton edge="end"
                                                    aria-label="edit">
                                            <EditIcon/>
                                        </IconButton>
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
                                <ListItemText primary={user.name}
                                              secondary={user.role}/>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            ))}

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
