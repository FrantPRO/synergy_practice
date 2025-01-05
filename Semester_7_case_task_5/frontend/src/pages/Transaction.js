import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import {useForm, FormProvider} from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import api from "../api";
import styles from "../styles/HomePageStyles";

function Transaction() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const methods = useForm({
        defaultValues: {
            amount: 0,
            category_id: "",
            description: "",
        },
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const categoriesResponse = await api.get("/categories");
                setCategories(categoriesResponse.data);

                if (id) {
                    const transactionResponse = await api.get(`/transactions/${id}`);
                    methods.reset(transactionResponse.data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [id, methods]);

    const handleSave = async (data) => {
        try {
            const userId = localStorage.getItem("user_id");
            if (!userId) {
                throw new Error("User ID not found. Log in again.");
            }
            const transactionData = {
                ...data,
                user_id: parseInt(userId, 10),
            };
            if (id) {
                await api.put(`/transactions/${id}`, transactionData);
                setSnackbar({
                    open: true,
                    message: "Transaction updated successfully!",
                    severity: "success",
                });
            } else {
                await api.post("/transactions", transactionData);
                setSnackbar({
                    open: true,
                    message: "Transaction created successfully!",
                    severity: "success",
                });
            }
            navigate("/");
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || "Failed to save transaction.",
                severity: "error",
            });
        }
    };

    const handleAddCategory = async () => {
        try {
            const response = await api.post("/categories", {name: newCategoryName});
            setCategories((prev) => [...prev, response.data]);
            setSnackbar({
                open: true,
                message: "Category added successfully!",
                severity: "success",
            });
            setOpenCategoryDialog(false);
            setNewCategoryName("");
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to add category.",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({...prev, open: false}));
    };

    if (isLoading) {
        return (
            <Box sx={styles.container}>
                <CircularProgress/>
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
        <FormProvider {...methods}>
            <Box sx={{display: "flex", justifyContent: "center", p: 3}}>
                <Box sx={{width: "60%", minWidth: "400px"}}>
                    <Typography variant="h5" gutterBottom>
                        {id ? "Edit Transaction" : "Create Transaction"}
                    </Typography>

                    <TextField
                        {...methods.register("amount", {required: "Amount is required"})}
                        label="Amount"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        size="small"
                        required
                        error={!!methods.formState.errors.amount}
                        helperText={methods.formState.errors.amount?.message}
                    />

                    <FormControl fullWidth margin="dense" size="small">
                        <InputLabel>Category</InputLabel>
                        <Select
                            {...methods.register("category_id", {required: "Category is required"})}
                            label="Category"
                            value={methods.watch("category_id") || ""}
                            onChange={(e) => methods.setValue("category_id", e.target.value)}
                            error={!!methods.formState.errors.category_id}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        startIcon={<AddIcon/>}
                        onClick={() => setOpenCategoryDialog(true)}
                        sx={{mt: 1, mb: 2}}
                    >
                        Add New Category
                    </Button>

                    <TextField
                        {...methods.register("description")}
                        label="Description"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        size="small"
                        multiline
                        rows={3}
                    />

                    <Box sx={{display: "flex", gap: 2, mt: 3}}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={methods.handleSubmit(handleSave)}
                            size="small"
                        >
                            {id ? "Save Changes" : "Create Transaction"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate("/")}
                            size="small"
                        >
                            Cancel
                        </Button>
                    </Box>

                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={3000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                        }}
                    >
                        <Alert severity={snackbar.severity}
                               sx={{width: "100%"}}>
                            {snackbar.message}
                        </Alert>
                    </Snackbar>

                    <Dialog
                        open={openCategoryDialog}
                        onClose={() => setOpenCategoryDialog(false)}
                    >
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Category Name"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                size="small"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setOpenCategoryDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddCategory} color="primary">
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </FormProvider>
    );
}

export default Transaction;
