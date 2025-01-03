import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    Button,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Alert, Snackbar
} from "@mui/material";
import api from "../api";

function ResponseDetails() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        async function fetchResponse() {
            try {
                const resp = await api.get(`/responses/${id}`);
                setResponse(resp.data)
                setLoading(false);
            } catch (error) {
                setLoading(false);
                navigate("/analytics")
            }
        }

        fetchResponse();
    }, [id]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({...prev, open: false}));
    };

    return (
        <Paper sx={{padding: 2}}>
            <Typography variant="h6">Response Details</Typography>
            <List>
                <ListItem>
                    <ListItemText primary="ID" secondary={response.id}/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Survey ID"
                                  secondary={response.survey_id}/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="User ID"
                                  secondary={response.user_id}/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Created At"
                                  secondary={new Date(response.created_at).toLocaleString()}/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Response Data"
                                  secondary={JSON.stringify(response.response, null, 2)}/>
                </ListItem>
            </List>

            <Button variant="outlined" color="secondary"
                    onClick={() => navigate("/analytics")} size="small">
                Return to list
            </Button>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >
                <Alert severity={snackbar.severity}
                       sx={{width: "100%"}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
}

export default ResponseDetails;
