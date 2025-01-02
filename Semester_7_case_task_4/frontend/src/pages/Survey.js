import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    Alert,
    Box,
    TextField,
    Typography,
    Button,
    Snackbar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
} from "@mui/material";
import {useForm, FormProvider, useFieldArray} from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api";

function Survey() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const methods = useForm({
        defaultValues: {
            id: "",
            name: "",
            description: "",
            questions: [],
            created_at: "",
        },
    });

    const {fields, append, remove} = useFieldArray({
        control: methods.control,
        name: "questions",
    });

    useEffect(() => {
        if (id) {
            async function fetchSurvey() {
                try {
                    const response = await api.get(`/surveys/${id}`);
                    methods.reset(response.data);
                } catch (error) {
                    setSnackbar({
                        open: true,
                        message: "Failed to retrieve survey information.",
                        severity: "error",
                    });
                }
            }

            fetchSurvey();
        }
    }, [id, methods]);

    const handleSave = async () => {
        try {
            const formData = methods.getValues();
            if (id) {
                await api.put(`/surveys/${id}`, formData);
                setSnackbar({
                    open: true,
                    message: "The survey has been successfully updated!",
                    severity: "success",
                });
            } else {
                await api.post("/surveys/", formData);
                setSnackbar({
                    open: true,
                    message: "The survey was successfully created!",
                    severity: "success",
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to save survey changes.",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({...prev, open: false}));
    };

    const addQuestion = () => {
        const newQuestion = {
            order: fields.length + 1,
            type: "text",
            question: "",
            options: [],
        };
        append(newQuestion);
    };

    const removeQuestion = (index) => {
        remove(index);
    };

    const handleQuestionChange = (index, field, value) => {
        methods.setValue(`questions.${index}.${field}`, value);
    };

    const handleOptionsChange = (index, options) => {
        methods.setValue(`questions.${index}.options`, options);
    };

    return (
        <FormProvider {...methods}>
            <Box sx={{display: "flex", justifyContent: "center", p: 3}}>
                <Box sx={{width: "60%", minWidth: "400px"}}>
                    <Typography variant="h5" gutterBottom>
                        {id ? "Edit Survey" : "Create Survey"}
                    </Typography>

                    <TextField
                        {...methods.register("name")}
                        label="Name"
                        name="name"
                        value={methods.watch("name", "")}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        size="small"
                        required
                        error={!!methods.formState.errors.name}
                        helperText={methods.formState.errors.name?.message}
                    />

                    <TextField
                        multiline
                        label="Description"
                        name="description"
                        value={methods.watch("description", "")}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        size="small"
                        {...methods.register("description")}
                    />

                    <Typography variant="h6" sx={{fontSize: "1.2rem", mt: 3}}>
                        Questions
                    </Typography>

                    {fields
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((field, index) => (
                            <Box key={field.id} sx={{
                                mb: 3,
                                p: 2,
                                border: "1px solid #ccc",
                                borderRadius: 1
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <Typography
                                        variant="subtitle1">Question {field.order}</Typography>
                                    <IconButton
                                        onClick={() => removeQuestion(index)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Box>

                                <FormControl fullWidth margin="dense"
                                             size="small">
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        value={methods.watch(`questions.${index}.type`) || "text"}
                                        label="Type"
                                        onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
                                    >
                                        <MenuItem value="text">Text</MenuItem>
                                        <MenuItem value="multiple_choice">Multiple
                                            Choice</MenuItem>
                                        <MenuItem value="radio">Radio
                                            Buttons</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Question"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    size="small"
                                    value={methods.watch(`questions.${index}.question`) || ""}
                                    onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                                />

                                {["multiple_choice", "radio"].includes(methods.watch(`questions.${index}.type`)) && (
                                    <Box sx={{mt: 2}}>
                                        <Typography
                                            variant="body2">Options</Typography>
                                        {methods.watch(`questions.${index}.options`)?.map((option, optionIndex) => (
                                            <Box key={optionIndex} sx={{
                                                display: "flex",
                                                gap: 1,
                                                alignItems: "center",
                                                mt: 1
                                            }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={option}
                                                    onChange={(e) => {
                                                        const newOptions = [...methods.watch(`questions.${index}.options`)];
                                                        newOptions[optionIndex] = e.target.value;
                                                        handleOptionsChange(index, newOptions);
                                                    }}
                                                />
                                                <IconButton
                                                    onClick={() => {
                                                        const newOptions = methods.watch(`questions.${index}.options`).filter((_, i) => i !== optionIndex);
                                                        handleOptionsChange(index, newOptions);
                                                    }}
                                                >
                                                    <DeleteIcon
                                                        fontSize="small"/>
                                                </IconButton>
                                            </Box>
                                        ))}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<AddIcon/>}
                                            onClick={() => {
                                                const newOptions = [...(methods.watch(`questions.${index}.options`) || []), ""];
                                                handleOptionsChange(index, newOptions);
                                            }}
                                        >
                                            Add Option
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        ))}

                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        onClick={addQuestion}
                        sx={{mt: 2}}
                    >
                        Add Question
                    </Button>

                    <Box sx={{display: "flex", gap: 2, mt: 3}}>
                        <Button variant="contained" color="primary"
                                onClick={handleSave} size="small">
                            Save changes
                        </Button>
                        <Button variant="outlined" color="secondary"
                                onClick={() => navigate("/")} size="small">
                            Return to list
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

export default Survey;
