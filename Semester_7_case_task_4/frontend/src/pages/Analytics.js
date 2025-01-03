import React, {useEffect, useState} from "react";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    IconButton, Typography, Button,
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import api from "../api";
import styles from "../styles/HomePageStyles";
import AddIcon from "@mui/icons-material/Add";

function Analytics() {
    const [responses, setResponses] = useState([]);
    const userRole = localStorage.getItem("user_role");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchResponses() {
            try {
                const resp = await api.get("/responses/");
                if (resp.status !== 200) {
                    console.log("Error API response", resp.statusText)
                }
                setResponses(resp.data)
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchResponses();
    }, []);

    const handleChartsClick = (responseId) => {
        navigate(`/charts/${responseId}`);
    };

    const handleEditClick = (responseId) => {
        navigate(`/responses/${responseId}`);
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
                            secondaryAction={
                                <>
                                    <Tooltip title="Charts">
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChartsClick(response.id);
                                            }}>
                                            <InsightsOutlinedIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </>
                            }
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
