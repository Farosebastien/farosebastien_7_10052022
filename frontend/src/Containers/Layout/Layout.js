import React from "react";
import { useWindowDimension } from "../../Hooks/windowHook";
import { useLocation } from "react-router-dom";
import Nav from "../../Components/Nav/Nav";
import Menu from "../Menu/Menu";

import "./Layout.css";

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