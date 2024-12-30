import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation
} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import Home from './pages/Home';
import Experiment from './pages/Experiment';
import Header from './components/Header';
import Footer from './components/Footer';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import ChartsPage from "./pages/ChartsPage";
import User from "./pages/User";

function RequireAuth({children}) {
    const token = localStorage.getItem("access_token");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{from: location.pathname}}/>; // Сохраняем путь
    }

    return children;
}

function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* Публичный маршрут для авторизации */}
                <Route path="/login" element={<LoginPage/>}/>

                {/* Все защищённые маршруты */}
                <Route
                    path="*"
                    element={
                        <RequireAuth>
                            <>
                                <Header/>
                                <main style={styles.wrapper}>
                                    <Routes>
                                        <Route path="/" element={<Home/>}/>
                                        <Route path="/experiment/:id?" element={<Experiment/>}/>
                                        <Route path="/analytics" element={<Analytics/>}/>
                                        <Route path="/users" element={<Users/>}/>
                                        <Route path="/user/:id?" element={<User/>}/>
                                        <Route path="/charts/:experimentId" element={<ChartsPage/>}/>
                                    </Routes>
                                </main>
                                <Footer/>
                            </>
                        </RequireAuth>
                    }
                />
            </Routes>
        </Router>
    );
}

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

export default AppRouter;
