import React, {useEffect, useState} from "react";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    IconButton,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import api from "../api";
import styles from "../styles/HomePageStyles";

function Analytics() {
    const [responses, setResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const userRole = localStorage.getItem("user_role");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchResponses() {
            try {
                const resp = await api.get("/responses/");
                setResponses(resp.data);
            } catch (error) {
                console.error("Error fetching responses:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchResponses();
    }, []);

    const handleEditClick = (responseId) => {
        navigate(`/responses/${responseId}`);
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
                        Results
                    </Typography>
                </Box>
                <List>
                    {responses.map((response) => (
                        <ListItem
                            key={response.id}
                            sx={{
                                "&:hover": {backgroundColor: "rgba(0, 0, 0, 0.08)"},
                                display: "flex",
                                cursor: "pointer",
                            }}
                            onClick={() => handleEditClick(response.id)}
                        >
                            <ListItemText
                                primary={`Survey ID: ${response.survey_id}`}
                                secondary={`${userRole === 'admin' ? `User ID: ${response.user_id}` : ''}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
}

export default Analytics;
