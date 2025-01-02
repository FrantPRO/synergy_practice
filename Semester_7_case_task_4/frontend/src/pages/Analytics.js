import React, {useEffect, useState} from "react";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    IconButton,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import api from "../api";

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
        console.log(`clicked edit ${responseId}`)
    }

    return (
        <Box sx={{p: 4}}>
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
    );
}

export default Analytics;
