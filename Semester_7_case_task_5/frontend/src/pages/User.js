import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Snackbar,
    Alert,
} from "@mui/material";
import api from "../api";

function User() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        password: "",
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        if (id !== "new") {
            async function fetchUser() {
                try {
                    const response = await api.get(`/users/${id}`);
                    if (response.status !== 200) {
                        console.log("Error API response", response.statusText)
                    }
                    setUser(response.data)
                } catch (error) {
                    console.error("Error fetching user by ID:", error);
                }
            }

            fetchUser();
        }
    }, [id]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser((prev) => ({...prev, [name]: value}));
    };

    const handleSave = async () => {
        if (id === "new") {
            try {
                const response = await api.post("/users", user);
                setSnackbar({
                    open: true,
                    message: "User created successfully",
                    severity: "success",
                });
                navigate("/users/");
            } catch (error) {
                if (error.response) {
                    setSnackbar({
                        open: true,
                        message: error.response.data.detail || "An error occurred",
                        severity: "error",
                    });
                } else {
                    console.error("Error saving user:", error);
                    setSnackbar({
                        open: true,
                        message: "Network error. Try again later.",
                        severity: "error",
                    });
                }
            }
        } else {
            try {
                await api.put(`/users/${id}`, user);
                setSnackbar({
                    open: true,
                    message: "User updated successfully",
                    severity: "success",
                });
                navigate("/users/");
            } catch (error) {
                console.error("Error update user:", error);
                setSnackbar({
                    open: true,
                    message: "Failed to update user",
                    severity: "error",
                });
            }
        }
    };

    return (
        <Box sx={{p: 4}}>
            <Typography variant="h4" gutterBottom>
                {id === "new" ? "Create user" : "Edit user"}
            </Typography>
            <TextField
                label="Name"
                name="username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={user.name}
                onChange={handleChange}
            />
            {id === "new" && (
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={user.password}
                    onChange={handleChange}
                />
            )}
            <Box sx={{display: "flex", gap: 2}}>
                <Button variant="contained" color="primary"
                        onClick={handleSave}>
                    Save
                </Button>
                <Button variant="outlined" color="secondary"
                        onClick={() => navigate("/users")}>
                    Cancel
                </Button>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert
                    onClose={() => setSnackbar((prev) => ({
                        ...prev,
                        open: false
                    }))}
                    severity={snackbar.severity}
                    sx={{width: "100%"}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default User;
