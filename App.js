import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'; // Update for React Router v6
import './styles.css';
import ProductManagement from './ProductManagement';
import UsersManagement from './UsersManagement';
import Dashboard from './Dashboard';
import Login from './Login';

function App() {
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedProducts = localStorage.getItem('products');
        const loginStatus = localStorage.getItem('isLoggedIn');

        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        }
        setIsLoggedIn(loginStatus === 'true');
    }, []);

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    };

    return (
        <Router>
            <div>
                <header>
                    <h1>WINGS CAFE INVENTORY SYSTEM - LIMKOKWING UNIVERSITY</h1>
                </header>

                {!isLoggedIn ? (
                    // Display the login page only when not logged in
                    <Login onLogin={handleLogin} />
                ) : (
                    <>
                        <nav>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/productManagement">Product Management</Link>
                            <Link to="/usersManagement">Users Management</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </nav>

                        <main>
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard products={products} />} />
                                <Route path="/productManagement" element={<ProductManagement setProducts={setProducts} />} />
                                <Route path="/usersManagement" element={<UsersManagement />} />
                                {/* Redirect to dashboard or the intended page if the user is logged in */}
                                <Route path="*" element={<Navigate to="/dashboard" />} />
                            </Routes>
                        </main>
                    </>
                )}
            </div>
        </Router>
    );
}

export default App;
