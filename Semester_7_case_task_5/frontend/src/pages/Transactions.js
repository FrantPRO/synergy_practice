import React, {useEffect, useState} from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Button,
    Tooltip,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add"; // Импортируем иконку "Add"
import api from "../api";
import styles from "../styles/HomePageStyles";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTransactionId, setCurrentTransactionId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const categoriesResponse = await api.get("/categories");
                setCategories(categoriesResponse.data);

                const transactionsResponse = await api.get("/transactions");
                setTransactions(transactionsResponse.data);
            } catch (error) {
                setError(error.message || "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const getCategoryNameById = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "Unknown Category";
    };

    const handleRowClick = (transactionId) => {
        navigate(`/transaction/${transactionId}`);
    };

    const handleDeleteClick = (transactionId, event) => {
        event.stopPropagation();
        setCurrentTransactionId(transactionId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/transactions/${currentTransactionId}`);
            setTransactions((prev) => prev.filter((transaction) => transaction.id !== currentTransactionId));
            setSnackbarMessage("Transaction deleted successfully!");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            setSnackbarMessage("Failed to delete transaction. Try again.");
        } finally {
            setOpenSnackbar(true);
            setOpenDialog(false);
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
                        Transactions
                    </Typography>

                    {/* Кнопка "New Transaction" */}
                    <Tooltip title="Create a new transaction">
                        <Button
                            variant="contained"
                            startIcon={<AddIcon/>}
                            onClick={() => navigate("/transaction")}
                        >
                            New Transaction
                        </Button>
                    </Tooltip>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow
                                    key={transaction.id}
                                    onClick={() => handleRowClick(transaction.id)}
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.08)",
                                            cursor: "pointer"
                                        },
                                    }}
                                >
                                    <TableCell>{transaction.id}</TableCell>
                                    <TableCell>{transaction.amount}</TableCell>
                                    <TableCell>
                                        {getCategoryNameById(transaction.category_id)}
                                    </TableCell>
                                    <TableCell>{transaction.type}</TableCell>
                                    <TableCell>
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={(e) => handleDeleteClick(transaction.id, e)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Delete Transaction</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this transaction?
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

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </Box>
    );
}

export default Transactions;
