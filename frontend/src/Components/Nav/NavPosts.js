import React from "react";

import menu from "../../images/menu-icon.svg";
import post from "../../images/post-icon.svg";

import NavBtn from "./../Buttons/NavBtn/NavBtn";

const NavPost = () => {
    return (
        <>
            <NavBtn id="menu" name="menu" icon={menu} link="/menu" iconColor="icon_white" />
            <NavBtn id="post" name="publier" icon={post} link="/post/new" iconColor="icon_white" />
        </>
    );
};

export default NavPost;
