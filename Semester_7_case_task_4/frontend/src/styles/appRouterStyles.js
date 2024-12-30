const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80vh', // Высота экрана
    },
    content: {
        flex: 1,
        padding: "20px",
        minHeight: "calc(100vh – 64px – 48px)", // Учитываем высоту Header и Footer
    },
};

export default styles;
