const authStyles = {
    main: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "radial-gradient(circle, rgba(254,196,102,1) 0%, rgba(16,96,164,0.8295912114845938) 82%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        margin: 0,
        padding: 0,
    },
    card: {
        width: "400px",
        padding: "2em",
        background: "white",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
    },
    avatar: {
        margin: "1em",
        display: "flex",
        justifyContent: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1em",
    },
    actions: {
        marginTop: "1em",
    },
    logoText: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 'bold',
        color: 'primary.main',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        padding: 2,
    },
};

export default authStyles;
