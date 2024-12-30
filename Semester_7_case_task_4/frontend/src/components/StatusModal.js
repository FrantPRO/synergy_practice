import React from "react";
import { Modal, Box, Typography, Grid, CircularProgress } from "@mui/material";

const StatusModal = ({ open, onClose, stages }) => (
    <Modal open={open} onClose={onClose}>
        <Box
            sx={{
                p: 4,
                backgroundColor: "white",
                borderRadius: 2,
                width: "80%",
                maxWidth: "600px",
                mx: "auto",
                mt: 10,
                boxShadow: 3,
            }}
        >
            {/* Заголовок */}
            <Typography variant="h6" mb={3} textAlign="center">
                Stage status
            </Typography>

            {/* Горизонтальное расположение этапов */}
            <Grid container spacing={3} justifyContent="center">
                {stages.map((stage, index) => {
                    const progress = (stage / 20) * 100; // Прогресс в процентах
                    return (
                        <Grid item key={index} sx={{ textAlign: "center" }}>
                            {/* Название этапа */}
                            <Typography variant="subtitle2" mb={1}>
                                {`Stage ${index + 1}`}
                            </Typography>

                            {/* CircularProgress с закрашиванием при 100% */}
                            <Box
                                position="relative"
                                display="inline-flex"
                                sx={{
                                    ...(progress === 100 && {
                                        backgroundColor: "#4caf50",
                                        borderRadius: "50%",
                                    }),
                                }}
                            >
                                <CircularProgress
                                    variant="determinate"
                                    value={progress}
                                    size={70}
                                    thickness={4}
                                    sx={{
                                        ...(progress === 100 && {
                                            color: "#4caf50", // Цвет при завершении
                                        }),
                                    }}
                                />
                                <Box
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    bottom={0}
                                    right={0}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Typography
                                        variant="caption"
                                        component="div"
                                        color={progress === 100 ? "white" : "textSecondary"}
                                    >
                                        {`${stage}/20`}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    </Modal>
);

export default StatusModal;
