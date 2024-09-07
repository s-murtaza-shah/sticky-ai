import React, { useState } from "react";
import "../styles/Login.css";

function Login() {

    function googleLogin() {
        window.open("http://localhost:4000/login/google", "_self")
    }

    return (
        <div className="outer-container">
            <div className="container">
                <div className="left">
                    <h1 className="app-name">StickyAI</h1>
                    <p className="tagline">Your gateway to productivity</p>
                </div>
                <div className="right">
                    <div className="login-form">
                        <h2 className="login-heading">Login</h2>
                        <form action="http://localhost:4000/login/local" method="post" >
                            <input type="email" name="username" placeholder="Email" required/>
                            <input type="password" name="password" placeholder="Password" required/>
                            <button type="submit" className="login-button">Login</button>
                        </form>
                        <button className="google-button" onClick={googleLogin}>
                            <img src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-pks9lbdv.png" alt="Google logo" className="google-icon"/>
                            Sign in with Google
                        </button>
                        <a className="register-link" href="/register">Don't have an account? Register here</a>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Login;