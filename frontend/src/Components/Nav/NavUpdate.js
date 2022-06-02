import React, { useContext } from "react";
import { AuthContext } from "../../Context/authContext";

import close from "../../images/close-icon.svg";

import NavBtn from "./../Buttons/NavBtn";

const NavLogin = (props) => {
    const auth = useContext(AuthContext);

    return (
        <>
            <NavBtn icon= {close} name="annuler" link={`/profile/${auth.userId}`} iconColor="icon_white" />
        </>
    );
};

export default NavLogin;
