import React, { useContext } from "react";
import { AuthContext } from "../../Context/authContext";
import { useParams } from "react-router-dom";
import back from "../../images/back-icon.svg";
import modify from "../../images/modify-icon.svg";

import NavBtn from "./../Buttons/NavBtn/NavBtn";

const NavUser = (props) => {
    const auth = useContext(AuthContext);
    const userId = Number(useParams().id);

    let modifyBtn;

    if (auth.userId === userId) {
        modifyBtn = (
            <NavBtn id="update-profile" name="modifier" icon={modify} link={`/user/${auth.userId}/update`} iconColor="icon_white" />
        );
    } else {
        modifyBtn = "";
    }
    
    return (
        <>
            <NavBtn id="back" name="retourner" icon={back} link="/posts" iconColor="icon_white" />
            {auth.userId && userId && modifyBtn}
        </>
    );
};

export default NavUser;
