import React, {useState} from "react";
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
import authStyles from "../styles/authStyles";
import {jwtDecode} from "jwt-decode";

function getUserInfoFromToken(token) {
    try {
        const decodedToken = jwtDecode(token);
        return {id: decodedToken.sub, name: decodedToken.name};
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}

function LoginPage() {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (event) => {
        event.preventDefault();

        if (isSignUp && password !== confirmPassword) {
            setSnackbar({
                open: true,
                message: "The passwords you entered do not match. Make sure both fields are identical.",
                severity: "error",
            });
            return;
        }

        try {
            const endpoint = isSignUp ? "/auth/register" : "/auth/login";
            const requestData = isSignUp
                ? {name: username, password: password}
                : `username=${username}&password=${password}`;
            const requestHeaders = {
                headers: {
                    "Content-Type": isSignUp ? "application/json" : "application/x-www-form-urlencoded",
                },
            };
            const response = await api.post(endpoint, requestData, requestHeaders);

            if (response.status === 200 || response.status === 201) {
                setSnackbar({
                    open: true,
                    message: isSignUp ? "Registration successful!" : "Login successful!",
                    severity: "success",
                });

                if (!isSignUp) {
                    localStorage.setItem("access_token", response.data.access_token);
                    const userInfo = getUserInfoFromToken(response.data.access_token);
                    localStorage.setItem("user_name", userInfo.name);
                    localStorage.setItem("user_id", userInfo.id);

                    setSnackbar({
                        open: true,
                        message: "Login successful!",
                        severity: "success"
                    });

                    const redirectTo = location.state?.from || "/";
                    navigate(redirectTo);
                } else {
                    setIsSignUp(false);
                }
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: isSignUp ? "Registration failed" : "Invalid name or password",
                severity: "error",
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
                        {isSignUp && (
                            <TextField
                                id="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth
                                style={{marginTop: "10px"}}
                                error={password !== confirmPassword && confirmPassword !== ""}
                                helperText={
                                    password !== confirmPassword && confirmPassword !== ""
                                        ? "The passwords you entered do not match. Please make sure both fields are identical."
                                        : ""
                                }
                            />
                        )}
                    </div>
                    <CardActions sx={authStyles.actions}>
                        <Button variant="contained" type="submit"
                                color="primary" fullWidth>
                            {isSignUp ? "Sign Up" : "Sign In"}
                        </Button>
                    </CardActions>
                    <Button
                        variant="text"
                        color="primary"
                        fullWidth
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{marginTop: "10px"}}
                    >
                        {isSignUp ? "Already registered? Sign In" : "Or register as a new user"}
                    </Button>
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
