import React from "react";
import { withRouter } from "react-router-dom";
import { useWindowDimension } from "../../Hooks/windowHook";

import Nav from "../../Components/Nav/Nav";
import Menu from "../Menu/Menu";

import "../../Styles/Containers/Layout.css";

const Layout = (props) => {
    const { width } = useWindowDimension();

    const path = props.location.pathname;

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

export default withRouter(Layout);
