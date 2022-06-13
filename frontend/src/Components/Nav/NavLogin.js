import React from "react";

import back from "../../images/back-icon.svg";
import login from "../../images/login-icon.svg";

import ActionBtn from "./../Buttons/ActionBtn/ActionBtn";

const NavLogin = (props) => {
    return (
        <>
            <ActionBtn icon={back} name="retourner" onClick={props.backHandle} iconColor="icon_white" />
            <ActionBtn id="login-btn" form="login-form" name="connexion" type="submit" icon={login} iconColor="icon_white" />
        </>
    );
};

export default NavLogin;
