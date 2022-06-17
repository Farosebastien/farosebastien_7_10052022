import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { AuthContext } from "../../Context/authContext";
import { useWindowDimension } from "../../Hooks/windowHook";

import GenProfile from "../../images/generic_profile_picture.jpg";
import modify from "../../images/modify-icon.svg";
import back from "../../images/back-icon.svg";

import NavBtn from "../../Components/Buttons/NavBtn/NavBtn";
import Spinner from "../../Components/LoadingSpinner/LoadingSpinner";

import styles from "./UserProfile.module.css";

const UserProfile = () => {
    //Auth context
    const auth = useContext(AuthContext);
    //Backend request hook
    const { isLoading, sendRequest } = useHttpRequest();
    //Profile Hook
    const [profileData, setProfileData] = useState();
    //Window size
    const { width } = useWindowDimension();
    //Id utilisateur
    const userId = Number(useParams().id);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await sendRequest(`${process.env.REACT_APP_API_URL}/user/${userId}`, "GET", null, {
                    Authorization: "Bearer " + auth.token
                });
                setProfileData(userData);
            } catch (err) {}
        };
        fetchUser();
    }, [sendRequest, auth.token, userId]);

    let btnStyle = styles.btnStyle;
    let iconStyle = styles.iconStyle;
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
                <div className={styles.container}>
                    <h2>No User Data!</h2>
                </div>
            </>
        );
    }
    let role;
    if(profileData.profile.role === 0) {
        role ="Utilisateur";
    } else {
        role = "Administrateur"
    }

    return (
        <>
            <div className={`container ${styles.class_mod}`}>
                {!isLoading && profileData && (
                    <>
                        <div className={styles.background_img}></div>
                        <div className={styles.wrapper}>
                            <img src={profileData.profile.photo_url || GenProfile} className={styles.profile_photo} alt={`${profileData.profile.username}`} />
                            <div className={styles.hero_block}>
                                <h2 className={styles.title}>{profileData.profile.firstname} {profileData.profile.lastname}</h2>
                                <h3 className={styles.username}>{profileData.profile.username}</h3>
                            </div>
                            <p className={styles.role}>{role}</p>
                            <a className={styles.email} href={`mailto:${profileData.profile.email}`}>
                                {profileData.profile.email}
                            </a>
                            {desktopNav}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default UserProfile;