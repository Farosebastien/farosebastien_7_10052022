import React from "react";

import back from "../../images/back-icon.svg";
import signup from "../../images/signup-icon.svg";

import ActionBtn from "./../Buttons/ActionBtn";

const NavSignUp = (props) => {
    return (
        <>
            <ActionBtn icon={back} name="retourner" onClick={props.backHandle} iconColor="icon_white" />
            <ActionBtn id="signup-btn" form="signup-form" name="s'inscrire" type="submit" icon={signup} iconColor="icon_white"/>
        </>
    );
};

export default NavSignUp;