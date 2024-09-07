import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import NotFound from "./Pages/NotFound";

function App() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const getAuthStatus = async () => {
            try {
                const status = await axios.get("http://localhost:4000/user");
                if (status.data.success) {
                    setUser(status.data.user);
                }
            } catch (err) {
                console.error("Failed to make status request: ", err);
            }
        }
        getAuthStatus();
    }, []);
    
    return (
        <div>
            <Navbar user={user} />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                    <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter> 
        </div>
    );
}

export default App;