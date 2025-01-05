import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
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
    ToggleButton,
    ToggleButtonGroup,
    Select,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
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

    const TransactionType = {
        INCOME: "income",
        EXPENSE: "expense",
    };

    const methods = useForm({
        defaultValues: {
            amount: 0,
            category_id: "",
            description: "",
            type: TransactionType.EXPENSE,
            date: new Date().toISOString().split('T')[0],
        },
    });

    const {
        register,
        watch,
        setValue,
        formState,
        handleSubmit,
        reset
    } = methods;

    useEffect(() => {
        async function fetchData() {
            try {
                const categoriesResponse = await api.get("/categories");
                setCategories(categoriesResponse.data);

                if (id) {
                    const transactionResponse = await api.get(`/transactions/${id}`);
                    if (transactionResponse.data) {
                        const transactionData = {
                            amount: transactionResponse.data.amount || 0,
                            category_id: transactionResponse.data.category_id || "",
                            description: transactionResponse.data.description || "",
                            type: transactionResponse.data.type || TransactionType.EXPENSE,
                            date: transactionResponse.data.date.split('T')[0],
                        };
                        reset(transactionData, {shouldUnregister: true});
                    } else {
                        setError("Transaction not found");
                    }
                } else {
                    reset({
                        amount: 0,
                        category_id: "",
                        description: "",
                        type: TransactionType.EXPENSE,
                        date: new Date().toISOString().split('T')[0],
                    }, {shouldUnregister: true});
                }
            } catch (error) {
                console.error('Error:', error);
                setError(error.message || "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [id, reset]);

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
            navigate("/transactions");
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

    const handleTypeChange = (event, newType) => {
        if (newType !== null) {
            setValue("type", newType);
        }
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

                    <Grid
                        container
                        spacing={2}
                        direction="row"
                        minHeight={70}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Grid size={{xs: 7, md: 7}}>
                            <Typography variant="h5" gutterBottom>
                                {id ? "Edit Transaction" : "Create Transaction"}
                            </Typography>
                        </Grid>
                        <Grid size={{xs: 5, md: 5}}>
                            <ToggleButtonGroup
                                value={watch("type") || TransactionType.EXPENSE}
                                exclusive
                                onChange={handleTypeChange}
                                aria-label="Transaction type"
                                fullWidth
                                sx={{height: "40px"}}
                            >
                                <ToggleButton
                                    value={TransactionType.INCOME}
                                    aria-label="Income"
                                    sx={{
                                        backgroundColor: watch("type") === TransactionType.INCOME ? "#4caf50 !important" : "#e0e0e0 !important",
                                        color: watch("type") === TransactionType.INCOME ? "#fff !important" : "#000 !important",
                                        "&:hover": {
                                            backgroundColor: watch("type") === TransactionType.INCOME ? "#388e3c !important" : "#bdbdbd !important",
                                        },
                                    }}
                                >
                                    Income
                                </ToggleButton>
                                <ToggleButton
                                    value={TransactionType.EXPENSE}
                                    aria-label="Expense"
                                    sx={{
                                        backgroundColor: watch("type") === TransactionType.EXPENSE ? "#f44336 !important" : "#e0e0e0 !important",
                                        color: watch("type") === TransactionType.EXPENSE ? "#fff !important" : "#000 !important",
                                        "&:hover": {
                                            backgroundColor: watch("type") === TransactionType.EXPENSE ? "#d32f2f !important" : "#bdbdbd !important",
                                        },
                                    }}
                                >
                                    Expense
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        spacing={2}
                        direction="row"
                        minHeight={60}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Grid size={{xs: 6, md: 6}}>
                            <TextField
                                {...register("amount", {required: "Amount is required"})}
                                label="Amount"
                                type="number"
                                variant="outlined"
                                fullWidth
                                size="small"
                                required
                                error={!!formState.errors.amount}
                                helperText={formState.errors.amount?.message}
                            />
                        </Grid>
                        <Grid size={{xs: 6, md: 6}}>
                            <TextField
                                label="Date"
                                type="date"
                                {...register("date", {required: "Date is required"})}
                                slotProps={{inputLabel: {shrink: true}}}
                                fullWidth
                                size="small"
                                required
                                error={!!formState.errors.date}
                                helperText={formState.errors.date?.message}
                            />
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        spacing={2}
                        direction="row"
                        minHeight={60}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Grid size={{xs: 8, md: 8}}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    {...register("category_id", {required: "Category is required"})}
                                    label="Category"
                                    value={watch("category_id") || ""}
                                    onChange={(e) => setValue("category_id", e.target.value)}
                                    error={!!formState.errors.category_id}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id}
                                                  value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{xs: 4, md: 4}}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<AddIcon/>}
                                onClick={() => setOpenCategoryDialog(true)}
                                sx={{height: "40px"}}
                            >
                                Add Category
                            </Button>
                        </Grid>
                    </Grid>

                    <TextField
                        {...register("description")}
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
                            onClick={handleSubmit(handleSave)}
                            size="small"
                        >
                            {id ? "Save Changes" : "Create Transaction"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate("/transactions")}
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
