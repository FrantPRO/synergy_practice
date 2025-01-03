import React, {useEffect, useState} from "react";
import {
    Box,
    Typography,
    Alert,
    CircularProgress,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {Bar, Line, Pie, Radar} from "react-chartjs-2";
import {useParams} from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    ArcElement,
    LineElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import api from "../api";
import styles from "../styles/HomePageStyles";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    ArcElement,
    LineElement,
    RadialLinearScale
);

function ChartsPage() {
    const {surveyId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState({
        barData: { labels: [], datasets: [] },
        lineData: { labels: [], datasets: [] },
        pieData: { labels: [], datasets: [] },
        radarData: { labels: [], datasets: [] },
    });

    useEffect(() => {
        async function fetchSurveyResult() {
            try {
                const resp = await api.get(`/responses/?survey_id=${surveyId}`);

                // Преобразуем данные для графиков
                const responses = resp.data;

                // 1. Подготовка данных для Bar Chart (Количество ответов на каждый вопрос)
                const barLabels = [];
                const barCounts = [];
                responses.forEach(response => {
                    response.response.forEach(item => {
                        if (!barLabels.includes(`Question ${item.question_id}`)) {
                            barLabels.push(`Question ${item.question_id}`);
                            barCounts.push(1);
                        } else {
                            const index = barLabels.indexOf(`Question ${item.question_id}`);
                            barCounts[index] += 1;
                        }
                    });
                });

                // 2. Подготовка данных для Pie Chart (Распределение ответов на первый вопрос)
                const pieLabels = [];
                const pieCounts = [];
                responses.forEach(response => {
                    response.response.forEach(item => {
                        if (item.question_id === 0) {
                            const answer = item.answer;
                            if (!pieLabels.includes(answer)) {
                                pieLabels.push(answer);
                                pieCounts.push(1);
                            } else {
                                const index = pieLabels.indexOf(answer);
                                pieCounts[index] += 1;
                            }
                        }
                    });
                });

                // 3. Подготовка данных для Radar Chart (Сравнение ответов пользователей)
                const radarLabels = ["Question 0", "Question 1", "Question 2"];
                const radarDatasets = responses.map((response, index) => ({
                    label: `User ${response.user_id}`,
                    data: radarLabels.map((_, qId) => {
                        const question = response.response.find(item => item.question_id === qId);
                        return question ? (Array.isArray(question.answer) ? question.answer.length : 1) : 0;
                    }),
                    backgroundColor: `rgba(${index * 50}, ${index * 100}, 192, 0.6)`,
                }));

                // 4. Подготовка данных для Line Chart (Динамика ответов по времени)
                const lineLabels = responses.map(response => new Date(response.created_at).toLocaleDateString());
                const lineCounts = responses.map(response => response.response.length);

                // Обновляем состояние с данными для графиков
                setChartData({
                    barData: {
                        labels: barLabels,
                        datasets: [
                            {
                                label: "Number of Answers",
                                data: barCounts,
                                backgroundColor: "rgba(75, 192, 192, 0.6)",
                            },
                        ],
                    },
                    pieData: {
                        labels: pieLabels,
                        datasets: [
                            {
                                label: "Answer Distribution",
                                data: pieCounts,
                                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                            },
                        ],
                    },
                    radarData: {
                        labels: radarLabels,
                        datasets: radarDatasets,
                    },
                    lineData: {
                        labels: lineLabels,
                        datasets: [
                            {
                                label: "Answers Over Time",
                                data: lineCounts,
                                borderColor: "#36A2EB",
                                fill: false,
                            },
                        ],
                    },
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSurveyResult();
    }, [surveyId]);

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
        <Box sx={{p: 4}}>
            <Typography variant="h4" mb={4}>
                Graphs for the survey {surveyId}
            </Typography>
            <Grid container spacing={4}>
                {/* Bar Chart */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" textAlign="center" mb={2}>
                        Number of Answers per Question
                    </Typography>
                    <Bar data={chartData.barData}/>
                </Grid>

                {/* Line Chart */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" textAlign="center" mb={2}>
                        Answers Over Time
                    </Typography>
                    <Line data={chartData.lineData}/>
                </Grid>

                {/* Pie Chart */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" textAlign="center" mb={2}>
                        Answer Distribution for Question 0
                    </Typography>
                    <Pie data={chartData.pieData}/>
                </Grid>

                {/* Radar Chart */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" textAlign="center" mb={2}>
                        User Responses Comparison
                    </Typography>
                    <Radar data={chartData.radarData}/>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ChartsPage;
