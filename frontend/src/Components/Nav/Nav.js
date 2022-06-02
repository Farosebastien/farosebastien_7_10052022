import React, { useContext } from "react";

import { withRouter } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";

import NavHome from "./NavHome";
import NavLogin from "./NavUpdate";
import NavSignUp from "./NavSignup";
import NavPost from "./NavPosts";
import NavMenu from "./NavMenu";
import NavNewPost from "./NavNewpost";
import NavComments from "./NavComments";
import NavProfile from "./NavProfile";
import NavUpdate from "./NavUpdate";

import "../../Styles/Components/Nav/Nav.css";

const Nav = (props) => {
    const auth = useContext(AuthContext);

    const id = props.location.pathname.split("/")[2];

    const backHandle = (e) => {
        e.preventDefault();
        props.history.goBack();
    };

    let nav;

    switch (props.location.pathname) {
        case"/":
            nav = <NavHome />;
    }
}
