import React, {useState} from "react";
import {
    Box,
    Typography,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";
import api from "../api";
import styles from "../styles/HomePageStyles";

function ImportExport() {
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleExport = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/transactions/export", {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "transactions.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();

            setSnackbar({
                open: true,
                message: "Transactions exported successfully!",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to export transactions.",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/transactions/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSnackbar({
                open: true,
                message: response.data.message,
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to import transactions.",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={styles.container}>
            <Typography variant="h5" gutterBottom>
                Import/Export Transactions
            </Typography>

            <Box sx={{mb: 4}}>
                <Typography variant="h6" gutterBottom>
                    Export Transactions
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleExport}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20}/> : null}
                >
                    Export Transactions
                </Button>
            </Box>

            <Box>
                <Typography variant="h6" gutterBottom>
                    Import Transactions
                </Typography>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleImport}
                    disabled={isLoading}
                    style={{display: "none"}}
                    id="import-file"
                />
                <label htmlFor="import-file">
                    <Button
                        variant="contained"
                        component="span"
                        disabled={isLoading}
                        startIcon={isLoading ?
                            <CircularProgress size={20}/> : null}
                    >
                        Import Transactions
                    </Button>
                </label>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}

export default ImportExport;
