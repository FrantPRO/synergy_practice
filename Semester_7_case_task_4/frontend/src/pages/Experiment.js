import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    Alert,
    Box,
    TextField,
    Typography,
    Button,
    MenuItem,
    Snackbar,
    Checkbox,
    Slider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {useWatch, useForm, FormProvider} from "react-hook-form";
import api from "../api";

function Experiment() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const genderOptions = ["Male", "Female", "Other"];
    const goalOptions = ["Awareness", "Engagement", "Conversion"];

    const methods = useForm({
        defaultValues: {
            name: "",
            code: "",
            active: false,
            videos: [],
            ta_country: "",
            ta_region: "",
            ta_age_from: 18,
            ta_age_to: 60,
            ta_brand: "",
            ta_gender: "",
            goal_ad: "",
            purpose_study: "",
            has_agreement: false,
            additional_profiling: "",
            parameters: {}, // JSON parameters
        },
        resolver: (values) => validateUserCreation(values),
    });

    const validateUserCreation = (values) => {
        const errors = {};
        if (!values.name) errors.name = "Name is required.";

        if (!values.videos || values.videos.length > 5) {
            errors.videos = "You can upload up to 5 videos.";
        } else {
            const invalidFile = values.videos.find((file) => !file.type.startsWith("video/"));
            if (invalidFile) {
                errors.videos = "Only video files are allowed.";
            }
        }

        if (!values.ta_country) errors.ta_country = "Country is required.";
        if (!values.ta_region) errors.ta_region = "Region is required.";
        if (!values.ta_age_from || values.ta_age_from < 18)
            errors.ta_age_from = "Minimum age is 18.";
        if (!values.ta_age_to || values.ta_age_to > 60)
            errors.ta_age_to = "Maximum age is 60.";
        return errors;
    };

    useEffect(() => {
        if (id) {
            async function fetchExperiment() {
                try {
                    const response = await api.get(`/experiments/${id}`);
                    if (!methods.formState.isInitialized) {
                        return <div>Loading...</div>;
                    }
                    methods.reset(response.data);
                } catch (error) {
                    setSnackbar({
                        open: true,
                        message: "Failed to retrieve experiment information.",
                        severity: "error",
                    });
                }
            }

            fetchExperiment();
        }
    }, [id, methods]);

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target;
        methods.setValue(name, type === "checkbox" ? checked : value, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const handleSave = async () => {
        const filesBase64 = await Promise.all(
            selectedFiles.map(async (file) => {
                const response = await fetch(file.src);
                const blob = await response.blob();
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            })
        );
        const generatedCode = getExperimentCode(
            methods.watch("ta_country", ""),
            methods.watch("ta_brand", ""),
            methods.watch("name", "")
        );

        const experimentWithFiles = {
            ...methods.watch(),
            code: generatedCode,
            videos: filesBase64.map((base64, index) => ({
                ...selectedFiles[index],
                src: base64,
            })),
        };

        const newTab = window.open();
        if (newTab) {
            newTab.document.write(
                `<pre>${JSON.stringify(experimentWithFiles, null, 2)}</pre>`
            );
        } else {
            setSnackbar({
                open: true,
                message: "Unable to open new tab. Check your browser settings.",
                severity: "error",
            });
        }

        // Prepare data for server side
        const payload = {
            searching_id: generatedCode,
            active: experimentWithFiles.active,
            experiment: experimentWithFiles.parameters || {},
            experiment_type: "pipline"
        }
        try {
            if (id) {
                await api.put(`/experiments/${id}`, payload);
                setSnackbar({
                    open: true,
                    message: "The experiment has been successfully updated!",
                    severity: "success",
                });
            } else {
                await api.post("/experiments/", payload);
                setSnackbar({
                    open: true,
                    message: "The experiment was successfully created!",
                    severity: "success",
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to save experiment changes.",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({...prev, open: false}));
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const updatedFiles = files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            src: URL.createObjectURL(file),// For preview
        }));
        setSelectedFiles(updatedFiles);
        methods.setValue("videos", updatedFiles, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const handleSaveJson = (updatedJson) => {
        methods.setValue("parameters", updatedJson, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const getExperimentCode = (country, brand, name) => {
        const d = new Date();
        const experiment_date = d.toLocaleDateString('ru-Ru', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
        }).replaceAll(".", "");

        country = country?.toLowerCase().replaceAll(" ", "_").replaceAll(/\W/gm, "") || "";
        brand = brand?.toLowerCase().replace(/([\,|\s].+)/g, "").replaceAll(/\W/gm, "") || "";
        name = name?.toLowerCase().replaceAll(" ", "_").replaceAll(/\W/gm, "") || "";

        let common_len = (`partner_${country}_${brand}_${name}_${experiment_date}`).length;
        if (common_len > 255) {
            name = name.slice(0, name.length - (common_len - 255));
        }

        return `partner_${country}_${brand}_${name}_${experiment_date}`.replaceAll(/_{1,}/g, "_");
    };

    const ExperimentCodeGenerator = ({control}) => {
        const country = useWatch({name: "ta_country", control});
        const brand = useWatch({name: "ta_brand", control});
        const name = useWatch({name: "name", control});
        const code = getExperimentCode(country, brand, name);

        return (
            <Typography variant="body2" color="textSecondary" sx={{mt: 2}}>
                Code: {code || "Incomplete data"}
            </Typography>
        );
    };

    return (
        <FormProvider {...methods}>
            <Box sx={{display: "flex", justifyContent: "center", p: 3}}>
                <Box sx={{width: "60%", minWidth: "400px"}}>
                    <Typography variant="h5" gutterBottom>
                        {id ? "Edit Experiment" : "Create Experiment"}
                    </Typography>

                    <Typography variant="h6" sx={{fontSize: "1.2rem", mt: 2}}>
                        Main Information
                    </Typography>

                    <Grid container spacing={2} alignItems="flex-end"
                          justifyContent="space-around">
                        <Grid size={{xs: 10, md: 10}}>
                            <ExperimentCodeGenerator control={methods.control}/>
                        </Grid>
                        <Grid size={{xs: 2, md: 2}}>
                            <Box sx={{display: "flex", alignItems: "center"}}>
                                <Checkbox
                                    {...methods.register("active")}
                                    checked={methods.watch("active")}
                                    onChange={(event) => methods.setValue("active", event.target.checked)}
                                    sx={{padding: "0"}}
                                />
                                <Typography variant="body2" sx={{ml: 1}}>
                                    Active
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <TextField
                        {...methods.register("name")}
                        label="Name"
                        name="name"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        size="small"
                        value={methods.watch("name", "")}
                        onChange={handleChange}
                        required
                        error={!!methods.formState.errors.name}
                        helperText={methods.formState.errors.name?.message}
                    />
                    <Typography variant="body2" sx={{mt: 1}}>
                        Videos (Upload up to 5 files)
                    </Typography>
                    <Button variant="contained" component="label" size="small">
                        Upload Files
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="video/*"
                            onChange={handleFileChange}
                        />
                    </Button>
                    {methods.formState.errors.videos && (
                        <Typography color="error" variant="body2" sx={{mt: 1}}>
                            {methods.formState.errors.videos.message}
                        </Typography>
                    )}

                    <Box sx={{mt: 2}}>
                        {selectedFiles.map((file, index) => (
                            <Typography key={index} variant="body2">
                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </Typography>
                        ))}
                    </Box>

                    {/* Target Audience */}
                    <Typography variant="h6" sx={{fontSize: "1.2rem", mt: 3}}>
                        Target Audience
                    </Typography>

                    <Grid container spacing={2}>

                        {/* Country and Region */}
                        <Grid size={{xs: 6, md: 6}}>
                            <TextField
                                {...methods.register("ta_country")}
                                label="Country"
                                name="ta_country"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                size="small"
                                value={methods.watch("ta_country", "")}
                                onChange={handleChange}
                                error={!!methods.formState.errors.name}
                                helperText={methods.formState.errors.name?.message}
                            />
                        </Grid>
                        <Grid size={{xs: 6, md: 6}}>
                            <TextField
                                label="Region"
                                name="ta_region"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                size="small"
                                value={methods.watch("ta_region", "")}
                                onChange={handleChange}
                                error={!!methods.formState.errors.name}
                                helperText={methods.formState.errors.name?.message}
                            />
                        </Grid>

                        {/* Age From, Age To, and Gender */}
                        <Grid size={{xs: 6, md: 6}}>
                            <Typography gutterBottom>Age Range</Typography>
                            <Slider
                                value={[methods.watch("ta_age_from", 18), methods.watch("ta_age_to", 60)]}
                                onChange={(event, newValue) => {
                                    methods.setValue("ta_age_from", newValue[0], {shouldValidate: true});
                                    methods.setValue("ta_age_to", newValue[1], {shouldValidate: true});
                                }}
                                valueLabelDisplay="auto"
                                min={18}
                                max={60}
                                marks={[
                                    {value: 18, label: "18"},
                                    {value: 60, label: "60"},
                                ]}
                            />
                            {methods.formState.errors.ta_age_from && (
                                <Typography color="error" variant="body2">
                                    {methods.formState.errors.ta_age_from.message}
                                </Typography>
                            )}
                            {methods.formState.errors.ta_age_to && (
                                <Typography color="error" variant="body2">
                                    {methods.formState.errors.ta_age_to.message}
                                </Typography>
                            )}
                        </Grid>
                        <Grid size={{xs: 6, md: 6}}>
                            <TextField
                                select
                                label="Gender"
                                name="ta_gender"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                size="small"
                                value={methods.watch("ta_gender", "")}
                                onChange={handleChange}
                            >
                                {genderOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Brand */}
                        <Grid size={{xs: 12, md: 12}}>
                            <TextField
                                {...methods.register("ta_brand")}
                                label="Brand"
                                name="ta_brand"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                size="small"
                                value={methods.watch("ta_brand", "")}
                                onChange={handleChange}
                                error={!!methods.formState.errors.name}
                                helperText={methods.formState.errors.name?.message}
                            />
                        </Grid>
                    </Grid>

                    {/* Objectives of Research and Advertising */}
                    <Typography variant="h6" sx={{fontSize: "1.2rem", mt: 3}}>
                        Study and Advertising Goals
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 4, md: 4}}>
                            <TextField
                                select
                                label="Advertising Goal"
                                name="goal_ad"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                size="small"
                                value={methods.watch("goal_ad", "")}
                                onChange={handleChange}
                            >
                                {goalOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{xs: 8, md: 8}}>
                            <TextField
                                label="Study Purpose"
                                name="purpose_study"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                size="small"
                                value={methods.watch("purpose_study", "")}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        multiline
                        label="Additional profiling"
                        name="additional_profiling"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        size="small"
                        helperText="You can specify any other characteristics of your target audience, however, each additional parameter may increase the time required to collect data. The exact timing will be confirmed after the moderation check."
                        value={methods.watch("additional_profiling", "")}
                        onChange={handleChange}
                    />

                    {/* Agreement */}
                    <Typography variant="h6" sx={{fontSize: "1.2rem", mt: 3}}>
                        User Agreement
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "16px"
                    }}>
                        <Checkbox
                            name="has_agreement"
                            checked={methods.watch("has_agreement", false)}
                            onChange={handleChange}
                            sx={{padding: "0 8px 0 0"}} //Reducing checkbox padding
                        />
                        <Typography variant="body2">
                            I accept the terms of this <a href="#">User
                            Agreement</a> and{" "}
                            <a href="#">Privacy Policy</a>.
                        </Typography>
                    </Box>

                    {/* JSON Parameters */}
                    <Typography variant="h6" sx={{fontSize: "1.2rem", mt: 3}}>
                        JSON Parameters
                    </Typography>
                    <TextField
                        label="JSON Parameters (Read-only)"
                        name="parameters"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        size="small"
                        multiline
                        rows={3}
                        value={JSON.stringify(methods.watch("parameters") || {}, null, 2)}
                        InputProps={{readOnly: true}}
                    />

                    {/* Control */}
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

export default Experiment;
