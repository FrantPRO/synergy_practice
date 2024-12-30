import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {
    TextField,
    Button,
    Card,
    CardActions,
    Snackbar,
    Alert
} from "@mui/material";
import api from "../api";
import authStyles from "../styles/authStyles"; // Подключаем стили
import {jwtDecode} from "jwt-decode";

function getUserInfoFromToken(token) {
    try {
        const decodedToken = jwtDecode(token);
        return {role: decodedToken.role, name: decodedToken.name};
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}

function LoginPage() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginMock = async (event) => {
        event.preventDefault();
        try {
            // Заглушка для авторизации
            if (username && password) {
                const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gU21pdGgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.y2gYAN4QvRrNNYT0-lMgRfAz7TFPvxhbNRYKXe-2NwM";
                localStorage.setItem("access_token", access_token);
                const userInfo = getUserInfoFromToken(access_token);
                localStorage.setItem("user_name", userInfo.name);
                localStorage.setItem("user_role", userInfo.role);

                const redirectTo = location.state?.from || "/";
                navigate(redirectTo);
            } else {
                throw new Error("Name and password are required");
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message,
                severity: "error"
            });
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post("/auth/login", {
                username: username,
                password: password
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });

            if (!response.ok) {
                setSnackbar({
                    open: true,
                    message: "Server connect error",
                    severity: "error"
                });
                console.log(response.statusText)
            }

            localStorage.setItem("access_token", response.data.access_token);
            const userInfo = getUserInfoFromToken(response.data.access_token);
            localStorage.setItem("user_name", userInfo.name);
            localStorage.setItem("user_role", userInfo.role);

            setSnackbar({
                open: true,
                message: "Login successful!",
                severity: "success"
            });

            const redirectTo = location.state?.from || "/";
            navigate(redirectTo);
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Invalid name or password",
                severity: "error"
            });
        }
    };

    return (
        <form noValidate onSubmit={handleLogin}>
            <div style={authStyles.main}>
                <Card sx={authStyles.card}>
                    <div style={authStyles.avatar}>
                        <img src="logo.svg" alt="Logo" width="150"/>
                    </div>
                    <div style={authStyles.form}>
                        <TextField
                            id="username"
                            label="Name"
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                        />
                    </div>
                    <CardActions sx={authStyles.actions}>
                        <Button variant="contained" type="submit"
                                color="primary" fullWidth>
                            Sign in
                        </Button>
                    </CardActions>
                </Card>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar((prev) => ({
                        ...prev,
                        open: false
                    }))}
                >
                    <Alert
                        severity={snackbar.severity}>{snackbar.message}</Alert>
                </Snackbar>
            </div>
        </form>
    );
}

export default LoginPage;
