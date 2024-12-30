import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Tooltip} from "@mui/material";

function ProgressButton({value, onClick}) {
    return (
        <Tooltip title="Experiment execution status">
            <Button
                onClick={onClick} // Обработчик клика
                sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0, // Убираем лишние отступы
                    minWidth: 0, // Убираем минимальную ширину кнопки
                    borderRadius: '50%', // Круглая форма
                    cursor: 'pointer', // Указатель при наведении
                    '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.1)', // Цвет фона при наведении
                    },
                }}
            >
                <CircularProgress variant="determinate" value={value}/>
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{color: 'text.secondary'}}
                    >
                        {`${Math.round(value)}%`}
                    </Typography>
                </Box>
            </Button>
        </Tooltip>
    );
}

ProgressButton.propTypes = {
    value: PropTypes.number.isRequired,
    onClick: PropTypes.func,
};

export default ProgressButton;
