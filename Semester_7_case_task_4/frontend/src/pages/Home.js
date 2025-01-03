import React, {useEffect, useState} from "react";
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
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
import AddIcon from "@mui/icons-material/Add";
import api from "../api";
import StatusModal from "../components/StatusModal";
import styles from "../styles/HomePageStyles";

const Home = () => {
    const [surveys, setSurveys] = useState([]);
    const [username, setUsername] = useState("");
    const [currentStages, setCurrentStages] = useState([]);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSurveyId, setSelectedSurveyId] = useState(null);
    const [userResponses, setUserResponses] = useState([]);
    const navigate = useNavigate();

    const userRole = localStorage.getItem("user_role");

    useEffect(() => {
        const storedUserName = localStorage.getItem("user_name");
        if (storedUserName) {
            setUsername(storedUserName);
        }

        async function fetchSurveys() {
            try {
                const response = await api.get("/surveys/");
                const sortedSurveys = response.data.sort((a, b) => a.id - b.id);
                const surveysWithStatus = sortedSurveys.map((exp) => ({
                    ...exp,
                    status: Math.floor(Math.random() * 101),
                    stages: [
                        Math.floor(Math.random() * 21),
                        Math.floor(Math.random() * 21),
                        Math.floor(Math.random() * 21),
                    ],
                }));
                setSurveys(surveysWithStatus);
            } catch (error) {
                console.error("Error fetching surveys:", error);
            }
        }

        async function fetchUserResponses() {
            try {
                const userId = localStorage.getItem("user_id"); // Предположим, что ID пользователя хранится в localStorage
                const response = await api.get(`/responses?user_id=${userId}`);
                setUserResponses(response.data);
            } catch (error) {
                console.error("Error fetching user responses:", error);
            }
        }

        fetchSurveys();
        fetchUserResponses();
    }, []);

    const hasUserResponded = (surveyId) => {
        return userResponses.some((response) => response.survey_id === surveyId);
    };

    const handleDeleteClick = (surveyId) => {
        setSelectedSurveyId(surveyId);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/surveys/${selectedSurveyId}`);
            setSurveys((prev) =>
                prev.filter((exp) => exp.id !== selectedSurveyId)
            );
            setSnackbarMessage("Survey deleted successfully!");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error deleting survey:", error);
            setSnackbarMessage("Failed to delete survey!");
            setOpenSnackbar(true);
        }
        setOpenDialog(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSurveyId(null);
    };

    const handleEditClick = (surveyId) => {
        if (userRole === 'admin') {
            navigate(`/survey/${surveyId}`);
        } else {
            if (hasUserResponded(surveyId)) {
                setSnackbarMessage("You have already responded to this survey!");
                setOpenSnackbar(true);
            } else {
                navigate(`/response/${surveyId}`);
            }
        }
    };

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
                        Surveys
                    </Typography>
                    {userRole === "admin" && (
                        <Tooltip title="Create a new survey">
                            <Button
                                variant="contained"
                                startIcon={<AddIcon/>}
                                component={Link}
                                to="/survey"
                                sx={{mb: 2}}
                            >
                                New survey
                            </Button>
                        </Tooltip>
                    )}
                </Box>

                {surveys.length === 0 ? (
                    <Box sx={{textAlign: "center", py: 5}}>
                        <Typography variant="h6" color="textSecondary">
                            No surveys found
                        </Typography>
                        {userRole === "admin" && (
                            <Typography variant="body2" color="textSecondary"
                                        sx={{mb: 2}}>
                                You can create a new survey to get started.
                            </Typography>
                        )}
                        {userRole === "admin" && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon/>}
                                onClick={() => navigate("/survey")}
                            >
                                Create Survey
                            </Button>
                        )}
                    </Box>
                ) : (
                    <List>
                        {surveys.map((survey) => (
                            <ListItem
                                key={survey.id}
                                sx={{
                                    "&:hover": {backgroundColor: "rgba(0, 0, 0, 0.08)"},
                                    display: "flex",
                                    cursor: userRole === 'admin' || !hasUserResponded(survey.id) ? "pointer" : "default",
                                    opacity: userRole === 'admin' ? 1 : hasUserResponded(survey.id) ? 0.6 : 1,
                                }}
                                onClick={() => {
                                    if (userRole === 'admin' || !hasUserResponded(survey.id)) {
                                        handleEditClick(survey.id);
                                    }
                                }}
                                secondaryAction={
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        {userRole !== 'admin' && hasUserResponded(survey.id) && (
                                            <Typography variant="body2"
                                                        color="success.main">
                                                Completed
                                            </Typography>
                                        )}
                                        {userRole === "admin" && (
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(survey.id);
                                                }}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        )}
                                    </Box>
                                }
                            >
                                <ListItemText
                                    primary={survey.name}
                                    secondary={survey.description}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Deleting an survey</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this survey?
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
            <StatusModal
                open={isStatusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                stages={currentStages}
            />
        </Box>
    );
};

export default Home;
