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
import Survey from './pages/Survey';
import SurveyResponse from './pages/SurveyResponse';
import Header from './components/Header';
import Footer from './components/Footer';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import ChartsPage from "./pages/ChartsPage";
import User from "./pages/User";
import ResponseDetails from "./pages/ResponseDetails";
import styles from "./styles/appRouterStyles";

function RequireAuth({children, role}) {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{from: location.pathname}}/>;
    }

    if (role && userRole !== role) {
        return <Navigate to="/"/>;
    }

    return children;
}

function ProtectedLayout({children}) {
    return (
        <>
            <Header/>
            <main style={styles.wrapper}>{children}</main>
            <Footer/>
        </>
    );
}

function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage/>}/>

                {/* Protected routes */}
                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <Home/>
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <Analytics/>
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/charts/:surveyId"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <ChartsPage/>
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/response/:surveyId"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <SurveyResponse/>
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/responses/:id"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <ResponseDetails/>
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/survey/:id?"
                    element={
                        <RequireAuth role="admin">
                            <ProtectedLayout>
                                <Survey/>
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <RequireAuth role="admin">
                            <ProtectedLayout>
                                <Users/>
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/user/:id?"
                    element={
                        <RequireAuth role="admin">
                            <ProtectedLayout>
                                <User/>
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
            </Routes>
        </Router>
    );
}

export default AppRouter;
