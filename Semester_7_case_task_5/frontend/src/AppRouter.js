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
import Transactions from "./pages/Transactions";
import Users from './pages/Users';
import User from "./pages/User";
import ImportExport from "./pages/ImportExport";
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
                    path="/transaction/:id?"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <Transaction/>
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/transactions"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <Transactions/>
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
                <Route
                    path="/import-export"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <ImportExport/>
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
            </Routes>
        </Router>
    );
}

export default AppRouter;
