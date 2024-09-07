import React from "react";
import "../styles/Register.css";

function Register() {

    return (

        <div className="register-container">
            <div className="left-section">
                <h1 className="app-name">StickyAI</h1>
                <p className="app-slogan">Your gateway to productivity</p>
            </div>
            <div className="right-section">
                <h2>Register</h2>
                <form className="register-form" action="http://localhost:4000/register" method="post">
                    <input type="text" name="fullname" placeholder="Full name" required />
                    <input type="email" name="username" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <button type="submit" className="register-button">Register</button>
                </form>
                <p className="login-link">Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );

}

export default Register;