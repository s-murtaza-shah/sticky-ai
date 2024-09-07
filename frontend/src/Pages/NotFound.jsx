import React from "react";
import "../styles/NotFound.css"

function NotFound() {
    return (
        <div className="not-found-container">
            <h1 className="error-code">404</h1>
            <p className="error-message">Oops! Page not found.</p>
            <p className="error-description">Sorry, the page you’re looking for doesn’t exist or has been moved.</p>
            <a href="/" className="home-link">Go to Home</a>
        </div>
    )
}

export default NotFound;