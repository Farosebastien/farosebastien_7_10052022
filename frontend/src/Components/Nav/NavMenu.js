import React from "react";

import close from "../../images/close-icon.svg";

import ActionBtn from "./../Buttons/ActionBtn/ActionBtn";

const NavMenu = (props) => {
    return (
        <>
            <ActionBtn icon={close} name="fermer" onClick={props.backHandle} iconColor="icon_white" />
        </>
    );
};

export default NavMenu;