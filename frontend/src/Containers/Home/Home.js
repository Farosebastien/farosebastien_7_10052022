import React from "react";

import logo from "../../images/logo.png";

import "./Home.css";

const Home = () => {
    return (
        <div className="background_image">
            <img src={logo} className="logo" alt="Logo de Groupomania" />
            <div className="welcome">
                <h3 className="title">Bienvenue</h3>
                <p className="message">sur le réseau social interne !!</p>
            </div>
        </div>
    );
};

export default Home;