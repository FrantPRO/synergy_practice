import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Snackbar,
    Alert,
} from "@mui/material";

function User() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        company: "",
        role: "",
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const roles = ["Administrator", "Researcher", "Manager"];

    useEffect(() => {
        if (id !== "new") {
            // Mock API call
            const fakeUser = {
                id,
                name: "John Smith",
                company: "Company 1",
                role: "Admin",
            };
            setUser(fakeUser);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setSnackbar({
            open: true,
            message: id === "new" ? "User created" : "User updated",
            severity: "success",
        });
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                {id === "new" ? "Create user" : "Edit user"}
            </Typography>
            <TextField
                label="First and last name"
                name="name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={user.name}
                onChange={handleChange}
            />
            <TextField
                label="Company"
                name="company"
                variant="outlined"
                fullWidth
                margin="normal"
                value={user.company}
                onChange={handleChange}
            />
            <TextField
                select
                label="Role"
                name="role"
                variant="outlined"
                fullWidth
                margin="normal"
                value={user.role}
                onChange={handleChange}
            >
                {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                        {role}
                    </MenuItem>
                ))}
            </TextField>
            <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate("/users")}>
                    Cancel
                </Button>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default User;
