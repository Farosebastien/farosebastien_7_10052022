import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { AuthContext } from "../../Context/authContext";
import { useWindowDimension } from "../../Hooks/windowHook";

import GenProfile from "../../images/generic_profile_picture.jpg";
import modify from "../../images/modify-icon.svg";
import back from "../../images/back-icon.svg";

import ErrorModal from "../../Components/ErrorModal/ErrorModal";
import NavBtn from "../../Components/Buttons/NavBtn/NavBtn";
import Counter from "../../Components/Counter/Counter";
import Spinner from "../../Components/LoadingSpinner/LoadingSpinner";

import styles from "./UserProfile.module.css";

const UserProfile = () => {
    //Auth context
    const auth = useContext(AuthContext);
    //Backend request hook
    const { isLoading, error, sendRequest, clearError } = useHttpRequest();
    //Profile Hook
    const [profileData, setProfileData] = useState();
    //Window size
    const { width } = useWindowDimension();
    //Id utilisateur
    const userId = Number(useParams().id);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await sendRequest(`http://localhost:5000/user/${userId}`, "GET", null, {
                    Authorization: "Bearer " + auth.token
                });
                setProfileData(userData);
            } catch (err) {}
        };
        fetchUser();
    }, [sendRequest, auth.token, userId]);

    let btnStyle = styles.btnStyle;
    let iconStyle = `${styles.iconStyle} icon_red`;
    let desktopNav;

    // Affichage Nav Desktop
    if (width >= 1024) {
        desktopNav = (
            <nav className={styles.nav}>
                <NavBtn id="back" name="retourner" icon={back} link="/post" btnStyle={btnStyle} iconColor={iconStyle} />
            </nav>
        );
    }

    // Validation Affichage Nav Desktop si l'utilisateur est le même qui s'affiche
    if (width >= 1024) {
        if (auth.userId === userId) {
            desktopNav = (
                <nav className={styles.nav}>
                    <NavBtn id="back" name="retourner" icon={back} link="/post" btnStyle={btnStyle} iconColor={iconStyle} />
                    <NavBtn id="update-profile" name="Modifier" icon={modify} link={`/user/${auth.userId}/update`} btnStyle={btnStyle} iconColor={iconStyle} />
                </nav>
            );
        }
    }

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className="spinner">
                    <Spinner />
                </div>
            </div>
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
            <div className={`container ${styles.class_mod}`}>
                {!isLoading && profileData && (
                    <>
                        <div className={styles.background_img}></div>
                        <div className={styles.wrapper}>
                            <img src={profileData.photo_url || GenProfile} className={styles.profile_photo} alt={`${profileData.username}`} />
                            <div className={styles.hero_block}>
                                <h2 className={styles.title}>{profileData.firstName} {profileData.lastName}</h2>
                                <h3 className={styles.title}>{profileData.username}</h3>
                            </div>
                            <p className={styles.role}>{profileData.role}</p>
                            <a className={styles.email} href={`mailto:${profileData.email}`}>
                                {profileData.email}
                            </a>
                            <Counter likesCount={profileData.likesCount || 0} postsCount={profileData.postsCount || 0} />
                            {desktopNav}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default UserProfile;