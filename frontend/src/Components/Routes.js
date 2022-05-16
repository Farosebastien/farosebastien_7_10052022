import React from "react";
import { Router, Route, Routes} from "react-router-dom";
import Home from "./../Pages/Home";
import Profil from "./../Pages/Profil";
import Trending from "./../Pages/Trending";

const UseRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" exact component={Home} />
                <Route path="/profil" exact component={Profil} />
                <Route path="/trending" exact component={Trending} />
            </Routes>
        </Router>
    );
};

export default UseRoutes;