import React from "react";

import back from "../../images/back-icon.svg";

import ActionBtn from "./../Buttons/ActionBtn/ActionBtn";

const NavComments = (props) => {
    return (
        <>
            <ActionBtn icon={back} name="retourner" onClick={props.backHandle} iconColor="icon_white" />
        </>
    );
};

export default NavComments;