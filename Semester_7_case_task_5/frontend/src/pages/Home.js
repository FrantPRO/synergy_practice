import React, {useEffect, useState} from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {Link} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import api from "../api";
import styles from "../styles/HomePageStyles";
import {Pie, Line} from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Home = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState({
        pieData: {labels: [], datasets: []},
        lineData: {labels: [], datasets: []},
    });

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good Morning!";
        if (hour >= 12 && hour < 18) return "Good Afternoon!";
        if (hour >= 18 && hour < 22) return "Good Evening!";
        return "Good Night!";
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const [transactionsResponse, categoriesResponse] = await Promise.all([
                    api.get("/transactions"),
                    api.get("/categories"),
                ]);

                setTransactions(transactionsResponse.data);
                setCategories(categoriesResponse.data);

                // Подготовка данных для графиков
                prepareChartData(transactionsResponse.data, categoriesResponse.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const prepareChartData = (transactions, categories) => {
        // 1. Круговая диаграмма: Распределение расходов по категориям
        const categoryExpenses = {};
        transactions.forEach((transaction) => {
            const category = categories.find((cat) => cat.id === transaction.category_id);
            if (category) {
                if (!categoryExpenses[category.name]) {
                    categoryExpenses[category.name] = 0;
                }
                categoryExpenses[category.name] += transaction.amount;
            }
        });

        const pieLabels = Object.keys(categoryExpenses);
        const pieData = Object.values(categoryExpenses);

        // 2. Линейный график: Динамика доходов и расходов за текущий месяц
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyData = {};
        transactions.forEach((transaction) => {
            const date = new Date(transaction.date);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                const day = date.getDate();
                if (!monthlyData[day]) {
                    monthlyData[day] = {income: 0, expense: 0};
                }
                if (transaction.amount > 0) {
                    monthlyData[day].income += transaction.amount;
                } else {
                    monthlyData[day].expense += Math.abs(transaction.amount);
                }
            }
        });

        const lineLabels = Object.keys(monthlyData).sort((a, b) => a - b);
        const incomeData = lineLabels.map((day) => monthlyData[day].income);
        const expenseData = lineLabels.map((day) => monthlyData[day].expense);

        setChartData({
            pieData: {
                labels: pieLabels,
                datasets: [
                    {
                        label: "Expenses by Category",
                        data: pieData,
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                    },
                ],
            },
            lineData: {
                labels: lineLabels,
                datasets: [
                    {
                        label: "Income",
                        data: incomeData,
                        borderColor: "#36A2EB",
                        fill: false,
                    },
                    {
                        label: "Expense",
                        data: expenseData,
                        borderColor: "#FF6384",
                        fill: false,
                    },
                ],
            },
        });
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
                        {getGreeting()}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        component={Link}
                        to="/transaction"
                        sx={{mb: 2}}
                    >
                        New Transaction
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" textAlign="center" mb={2}>
                        Expenses by Category
                    </Typography>
                    <Pie data={chartData.pieData}/>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" textAlign="center" mb={2}>
                        Income and Expenses (Current Month)
                    </Typography>
                    <Line data={chartData.lineData}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;
