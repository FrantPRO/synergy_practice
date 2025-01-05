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
import Header from './components/Header';
import Footer from './components/Footer';
import Transaction from './pages/Transaction';
import Users from './pages/Users';
import User from "./pages/User";
import styles from "./styles/appRouterStyles";

function RequireAuth({children}) {
    const token = localStorage.getItem("access_token");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{from: location.pathname}}/>;
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
                    path="/transaction"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <Transaction/>
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <Users/>
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/user/:id?"
                    element={
                        <RequireAuth>
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
