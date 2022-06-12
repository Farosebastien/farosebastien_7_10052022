import React from "react";
//import withRouter from "../../Hooks/withRouter";
import { useWindowDimension } from "../../Hooks/windowHook";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Nav from "../../Components/Nav/Nav";
import Menu from "../Menu/Menu";

import "../../Styles/Containers/Layout/Layout.css";

/*function withRouter(Component) {
    function ComponentWithRouterProps(props) {
        const location = useLocation();
        const navigate = useNavigate();
        const params = useParams();
        return (
            <Component {...props} router={{ location, navigate, params }} />
        );
    }
    return ComponentWithRouterProps;
}*/

const Layout = (props) => {
    const { width } = useWindowDimension();

    const path = useLocation().pathname;

    const mobileLayout = (
        <>
            <main className="home_wrapper">{props.children}</main>
            <Nav />
        </>
    );

    const desktopLayout = (
        <>
            <div className="desktop_wrap">
                <Menu />
                <main className="wrapper">{props.children}</main>
            </div>
            <p className="disclaimer">
                Groupomania 2022! En aucun cas, la société ne pourra être tenue pour responsable du comportement de ses employés sur ce site!
            </p>
        </>
    );

    if (width <= 1023) {
        return mobileLayout;
    }

    if (width >= 1024) {
        switch (path) {
            case "/":
                return mobileLayout;
            case "/login":
                return mobileLayout;
            case "/signup":
                return mobileLayout;
            default:
                return desktopLayout;
        }
    }
};

export default Layout;