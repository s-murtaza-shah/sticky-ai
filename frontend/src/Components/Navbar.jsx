import React from "react";
import "../styles/Navbar.css";

function Navbar( { user }) {

    function onLogout() {
        window.open("http://localhost:4000/logout", "_self");
    }

    return (
        user ? (
            <nav className="navbar">
                <div className="navbar-left">
                    <h1 className="app-title">StickyAI</h1>
                </div>
                <div className="navbar-right">
                    <img src={user.photo} alt="User" className="user-photo" />
                    <span className="user-name">{user.fullname}</span>
                    <button className="logout-button" onClick={onLogout}>Logout</button>
                </div>
            </nav>
        ) : (
            <nav className="navbar">
                <div className="navbar-left">
                    <h1 className="app-title">StickyAI</h1>
                </div>
            </nav>
        )
    );
}

export default Navbar;