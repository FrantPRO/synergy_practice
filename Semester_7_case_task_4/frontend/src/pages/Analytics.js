import React, {useEffect, useState} from "react";
import {
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    Tooltip,
    IconButton,
    Snackbar,
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import InsertDriveFileOutlinedIcon
    from "@mui/icons-material/InsertDriveFileOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ProgressButton from "../components/ProgressButton";
import StatusModal from "../components/StatusModal";
import DownloadModal from "../components/DownloadModal";

function Analytics() {
    const [experiments, setExperiments] = useState([]);
    const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [currentStages, setCurrentStages] = useState([]);
    const [currentExperiment, setCurrentExperiment] = useState(null);
    const navigate = useNavigate();
    const chartData = {
        barData: {
            labels: ["Этап 1", "Этап 2", "Этап 3"],
            datasets: [
                {
                    label: "Passing stages",
                    data: [20, 15, 12],
                    backgroundColor: "rgba(75,192,192,0.6)",
                },
            ],
        },
        lineData: {
            labels: ["January", "February", "March", "April"],
            datasets: [
                {
                    label: "Monthly values",
                    data: [5, 10, 7, 15],
                    borderColor: "rgba(255,99,132,1)",
                    backgroundColor: "rgba(255,99,132,0.2)",
                    fill: true,
                },
            ],
        },
        pieData: {
            labels: ["Category A", "Category B", "Category C"],
            datasets: [
                {
                    label: "Parceling",
                    data: [10, 20, 30],
                    backgroundColor: [
                        "rgba(255,99,132,0.6)",
                        "rgba(54,162,235,0.6)",
                        "rgba(75,192,192,0.6)",
                    ],
                },
            ],
        },
        radarData: {
            labels: ["Metric 1", "Metric 2", "Metric 3", "Metric 4"],
            datasets: [
                {
                    label: "Comparison",
                    data: [10, 15, 20, 10],
                    borderColor: "rgba(54,162,235,1)",
                    backgroundColor: "rgba(54,162,235,0.2)",
                    pointBackgroundColor: "rgba(54,162,235,1)",
                },
            ],
        },
    };


    // Fetch experiments
    useEffect(() => {
        const fakeExperiments = [
            {id: 1, name: "Experiment 1", status: 95, stages: [20, 19, 16]},
            {id: 2, name: "Experiment 2", status: 56, stages: [10, 8, 6]},
            {id: 3, name: "Experiment 3", status: 16, stages: [10, 8, 6]},
        ];
        setExperiments(fakeExperiments);
    }, []);

    const handleProgressButtonClick = (stages) => {
        setCurrentStages(stages);
        setStatusModalOpen(true);
    };

    const handleReportClick = (experimentId) => {
        setCurrentExperiment(experimentId);
        setDownloadModalOpen(true);
    };

    const handleChartsClick = (experimentId, chartData) => {
        navigate(`/charts/${experimentId}`, {state: {chartData}});
    };


    return (
        <Box sx={{p: 4}}>

            <List>
                {experiments.map((experiment) => (
                    <ListItem
                        key={experiment.id}
                        sx={{
                            "&:hover": {backgroundColor: "rgba(0, 0, 0, 0.08)"},
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <ListItemText primary={experiment.name}/>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                        }}>
                            <ProgressButton
                                value={experiment.status}
                                onClick={() => handleProgressButtonClick(experiment.stages)}
                            />
                            <Tooltip title="Uploading analysis">
                                <IconButton
                                    onClick={() => handleReportClick(experiment.id)}>
                                    <InsertDriveFileOutlinedIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Charts">
                                <IconButton
                                    onClick={() => handleChartsClick(experiment.id, chartData)}>
                                    <InsightsOutlinedIcon/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </ListItem>
                ))}
            </List>

        </Box>
    );
}

export default Analytics;
