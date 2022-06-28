import React, { useContext } from "react";
import { AuthContext } from "../../Context/authContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import NavHome from "./NavHome";
import NavLogin from "./NavLogin";
import NavSignUp from "./NavSignup";
import NavPost from "./NavPosts";
import NavMenu from "./NavMenu";
import NavNewPost from "./NavNewpost";
import NavComments from "./NavComments";
import NavUser from "./NavUser";
import NavUpdate from "./NavUpdate";

import "./Nav.css";

const Nav = (props) => {
    const auth = useContext(AuthContext);
    const path = useLocation().pathname;
    const history = useNavigate();

    const { id } = useParams();
    

    const backHandle = (e) => {
        e.preventDefault();
        history(-1);
    };

    let nav;

    switch (path) {
        case "/":
            nav = <NavHome />;
            break;
        case "/login":
            nav = <NavLogin backHandle={backHandle} />;
            break;
        case "/signup":
            nav = <NavSignUp backHandle={backHandle} />;
            break;
        case "/post":
            if (auth.isLoggedIn) {
                nav = <NavPost backHandle={backHandle} />;
            }
            break;
        case "/menu":
            if (auth.isLoggedIn) {
                nav = <NavMenu backHandle={backHandle} />;
            }
            break;
        case "/post/new":
            if (auth.isLoggedIn) {
                nav = <NavNewPost backHandle={backHandle} />;
            }
            break;
        case `/post/${id}`:
            if (auth.isLoggedIn) {
                nav = <NavComments backHandle={backHandle} commentHandle={backHandle} />;
            }
            break;
        case `/user/${id}`:
            if (auth.isLoggedIn) {
                nav = <NavUser backHandle={backHandle} />;
            }
            break;
        case `/user/${auth.userId}/update`:
            if (auth.isLoggedIn) {
                nav = <NavUpdate />;
            }
            break;
        default:
            if (auth.isLoggedIn) {
                nav = <NavComments backHandle={backHandle} commentHandle={backHandle} />;
            }
    }

    return (
        <footer>
            <div className="nav_btn_list">{nav}</div>
        </footer>
    );
};

export default Nav;