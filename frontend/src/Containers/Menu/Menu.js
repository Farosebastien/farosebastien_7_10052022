import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useWindowDimension} from "./../../Hooks/windowHook";
import { useHttpRequest } from "./../../Hooks/httpRequestHook";
import { AuthContext } from "../../Context/authContext";

//Images
import Genprofile from "../../images/generic_profile_picture.jpg";
import person from "../../images/person-icon.svg";
import agenda from "../../images/agenda-icon.svg";
import logout from "../../images/logout-icon.svg";
import posts from "../../images/posts-icon.svg";

//Components
import ErrorModal from "./../../Components/ErrorModal/ErrorModal";
import Spinner from "./../../Components/LoadingSpinner/LoadingSpinner";

import styles from "../../Styles/Containers/Menu/Menu.css"

const Menu = () => {
    //Auth context
    const auth = useContext(AuthContext);
    //Requête back
    const { isloading, error, sendRequest, clearError } = useHttpRequest();
    //Taille de la fenêtre
    const { width } = useWindowDimension();
    //Historique
    const history = useHistory();
    //Profil
    const [profileData, setProfileData] = useState();
    //Récuperation de posts récents
    useEffect(() => {
        let mounted = true;
        if (auth.token && auth.userId) {
            const fetchPosts = async () => {
                try {
                    const userData = await sendRequest(`http://localhost:3000/profile/${auth.userId}`, "GET", null, {Authorization: "Bearer " + auth.token});
                    if (mounted) {
                        setProfileData(userData);
                    }
                } catch (err) {}
            };
            fetchPosts();
        }
        return () => (mounted = false);
    }, [sendRequest, auth.token, auth.userId, setProfileData]);

    const logoutHandler = (event) => {
        event.preventDefault();
        auth.logout();
        history.push("/");
    };
    //Affichage navlinks desktop
    let navlinks;

    if (width >= 1024) {
        navlinks = (
            <>
                <Link to="/posts" className={`${styles.btn} ${styles.border}`}>
                    <span className={styles.text}>Publications</span>
                    <img className={`${styles.icon} icon_white`} src={posts} alt="" />
                </Link>
            </>
        );
    }
    if (isloading) {
        return (
            <>
                <div className={styles.container}>
                    <div className="spinner">
                        <Spinner />
                    </div>
                </div>
            </>
        );
    }
    if (!profileData) {
        return (
            <>
                <ErrorModal error={error} onClear={clearError} />
                <div className={styles.container}>
                    <h2>No User Data!</h2>
                </div>
            </>
        );
    }
    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <>
                {!isloading && profileData && (
                    <div className={styles.cover}>
                        <div className={styles.background_img}></div>
                        <div className={styles.wrapper}>
                            <img src={profileData.photo_url || Genprofile} className={styles.profile_photo} alt={`${profileData.username}`} />
                            <div className={styles.hero_block}>
                                <h2 className={styles.title}> Bienvenue {profileData.username} !</h2>
                            </div>
                        </div>
                        <nav className={styles.list}>
                            <Link to={`profile/${auth.userId}`} className={`${styles.btn} ${styles.border}`}>
                                <span className={styles.text}>Mon profil</span>
                                <img className={`${styles.icon} icon_white`} src={person} alt="" />
                            </Link>
                            {navlinks}
                            <Link to="/posts" className={`${styles.btn} ${styles.border}`}>
                                <span className={styles.text}>Annuaire</span>
                                <img className={`${styles.icon} icon_white`} src={agenda} alt="" />
                            </Link>
                            <button className={`${styles.btn} ${styles.logout_margin}`} onClick={logoutHandler}>
                                <span className={styles.text}>Se déconnecter</span>
                                <img className={`${styles.icon} icon_white`} src={logout} alt="" />
                            </button>
                        </nav>
                    </div>
                )}
            </>
        </>
    );
};

export default Menu;