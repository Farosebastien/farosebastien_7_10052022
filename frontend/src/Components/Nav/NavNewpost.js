import React from "react";

import back from "../../images/back-icon.svg";
import send from "../../images/send-icon.svg";

import ActionBtn from "./../Buttons/ActionBtn";

const NavNewPost = (props) => {
    return (
        <>
            <ActionBtn icon={back} name="retourner" onClick={props.backKandle} iconColor="icon_white" />
            <ActionBtn id="send-post-btn" form="send-post-form" name="publier" type="submit" icon={send} iconColor="icon_white" />
        </>
    );
};

export default NavNewPost;