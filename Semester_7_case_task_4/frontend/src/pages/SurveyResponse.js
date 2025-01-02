import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    Alert,
    Box,
    TextField,
    Typography,
    Button,
    Snackbar,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    FormGroup,
} from "@mui/material";
import {useForm, FormProvider} from "react-hook-form";
import api from "../api";

function SurveyResponse() {
    const {surveyId} = useParams();
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);

    const methods = useForm({
        defaultValues: {
            responses: {},
        },
    });

    useEffect(() => {
        if (surveyId) {
            async function fetchSurvey() {
                try {
                    const response = await api.get(`/surveys/${surveyId}`);
                    setSurvey(response.data);
                    setLoading(false);
                } catch (error) {
                    setSnackbar({
                        open: true,
                        message: "Failed to load survey.",
                        severity: "error",
                    });
                    setLoading(false);
                }
            }

            fetchSurvey();
        }
    }, [surveyId]);

    const handleSubmit = async () => {
        try {
            const responses = methods.getValues("responses");

            const responsesArray = Object.keys(responses).map((key) => ({
                question_id: parseInt(key, 10), // Номер вопроса
                answer: responses[key], // Ответ
            }));

            await api.post(`/responses/${surveyId}`, {responses: responsesArray});
            setSnackbar({
                open: true,
                message: "Your responses have been saved!",
                severity: "success",
            });
            navigate("/");
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to save responses.",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({...prev, open: false}));
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!survey) {
        return <Typography>Survey not found.</Typography>;
    }

    return (
        <FormProvider {...methods}>
            <Box sx={{display: "flex", justifyContent: "center", p: 3}}>
                <Box sx={{width: "60%", minWidth: "400px"}}>
                    <Typography variant="h5" gutterBottom>
                        {survey.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {survey.description}
                    </Typography>

                    {survey.questions
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((question, index) => (
                            <Box key={index} sx={{
                                mb: 3,
                                p: 2,
                                border: "1px solid #ccc",
                                borderRadius: 1
                            }}>
                                <Typography variant="h6"
                                            sx={{fontSize: "1.1rem", mb: 2}}>
                                    {question.question}
                                </Typography>

                                {question.type === "text" && (
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        margin="dense"
                                        size="small"
                                        multiline
                                        rows={4}
                                        {...methods.register(`responses.${index}`)}
                                    />
                                )}

                                {question.type === "radio" && (
                                    <RadioGroup
                                        value={methods.watch(`responses.${index}`) || ""}
                                        onChange={(e) => methods.setValue(`responses.${index}`, e.target.value)}
                                    >
                                        {question.options.map((option, optionIndex) => (
                                            <FormControlLabel
                                                key={optionIndex}
                                                value={option}
                                                control={<Radio/>}
                                                label={option}
                                            />
                                        ))}
                                    </RadioGroup>
                                )}

                                {question.type === "multiple_choice" && (
                                    <FormGroup>
                                        {question.options.map((option, optionIndex) => (
                                            <FormControlLabel
                                                key={optionIndex}
                                                control={
                                                    <Checkbox
                                                        checked={methods.watch(`responses.${index}`)?.includes(option) || false}
                                                        onChange={(e) => {
                                                            const currentValues = methods.watch(`responses.${index}`) || [];
                                                            const newValues = e.target.checked
                                                                ? [...currentValues, option]
                                                                : currentValues.filter((val) => val !== option);
                                                            methods.setValue(`responses.${index}`, newValues);
                                                        }}
                                                    />
                                                }
                                                label={option}
                                            />
                                        ))}
                                    </FormGroup>
                                )}
                            </Box>
                        ))}

                    <Box sx={{display: "flex", gap: 2, mt: 3}}>
                        <Button variant="contained" color="primary"
                                onClick={handleSubmit} size="small">
                            Submit
                        </Button>
                        <Button variant="outlined" color="secondary"
                                onClick={() => navigate("/")} size="small">
                            Cancel
                        </Button>
                    </Box>

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
                </Box>
            </Box>
        </FormProvider>
    );
}

export default SurveyResponse;
