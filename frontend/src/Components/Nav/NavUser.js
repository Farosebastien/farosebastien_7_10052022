import React, { useContext } from "react";
//import withRouter from "../../Hooks/withRouter";
import { AuthContext } from "../../Context/authContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import back from "../../images/back-icon.svg";
import modify from "../../images/modify-icon.svg";

import NavBtn from "./../Buttons/NavBtn";

/*function withRouter(Component) {
    function ComponentWithRouterProps(props) {
        const location = useLocation();
        const navigate = useNavigate();
        const params = useParams();
        return (
            <Component {...props} router={{ location, navigate, params }} />
        );
    }
    return ComponentWithRouterProps;
}*/

const NavUser = (props) => {
    const auth = useContext(AuthContext);
    const path = useLocation()
    const userId = Number(path.split("/")[2]);

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
