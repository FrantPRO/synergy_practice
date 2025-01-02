import React from "react";
import {Box, Typography, Grid} from "@mui/material";
import {Bar, Line, Pie, Radar} from "react-chartjs-2";
import {useParams, useLocation} from "react-router-dom";
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
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, ArcElement, LineElement, RadialLinearScale);

function ChartsPage() {
    const {surveyId} = useParams();
    const location = useLocation();
    const chartData = location.state?.chartData;

    if (!chartData) {
        return (
            <Box sx={{p: 4}}>
                <Typography variant="h4" mb={4}>
                    No data to display graphs
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{p: 4}}>
            <Typography variant="h4" mb={4}>
                Graphs for the survey {surveyId}
            </Typography>
            <Grid container spacing={4}>
                {/* Первый график: Бар */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" textAlign="center" mb={2}>
                        Passing stages
                    </Typography>
                    <Bar data={chartData.barData}/>
                </Grid>

                {/* Второй график: Линейный */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" textAlign="center" mb={2}>
                        Dynamics of values
                    </Typography>
                    <Line data={chartData.lineData}/>
                </Grid>

                {/* Третий график: Круговой (Pie) */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" textAlign="center" mb={2}>
                        Distribution of values
                    </Typography>
                    <Pie data={chartData.pieData}/>
                </Grid>

                {/* Четвертый график: Радиальный (Radar) */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" textAlign="center" mb={2}>
                        Metric comparison
                    </Typography>
                    <Radar data={chartData.radarData}/>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ChartsPage;
