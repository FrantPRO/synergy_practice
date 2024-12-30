import React from "react";
import {
    Modal,
    Box,
    Typography,
    Grid,
    Button, Tooltip,
} from "@mui/material";

const DownloadModal = ({open, onClose, onDownload}) => {
    const formats = [
        { label: "CSV", tooltip: "Save as CSV format" },
        { label: "Excel", tooltip: "Save in Excel format" },
        { label: "CSV for LM", tooltip: "Save for LM" },
    ];

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    p: 4,
                    backgroundColor: "white",
                    borderRadius: 2,
                    width: "80%",
                    maxWidth: "400px",
                    mx: "auto",
                    mt: 10,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h6" mb={3} textAlign="center">
                    Select download format
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {formats.map((format) => (
                        <Grid item key={format.label}>
                            <Tooltip title={format.tooltip}>
                                <Button
                                    variant="contained"
                                    onClick={() => onDownload(format.label)}
                                    sx={{
                                        width: "120px", // Фиксированная ширина
                                        height: "50px", // Фиксированная высота
                                    }}
                                >
                                    {format.label}
                                </Button>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Modal>
    );
};

export default DownloadModal;
