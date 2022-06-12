import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { useForm } from "../../Hooks/formHook";
import { isEmail, MinLength, MaxLength, isText } from "../../Utils/validators";
import { useWindowDimension } from "../../Hooks/windowHook";

import ErrorModal from "../../Components/ErrorModal/ErrorModal";
import ComfirmModal from "../../Components/ConfirmModal/ConfirmModal";
import NavBtn from "../../Components/Buttons/NavBtn";
import UIBtn from "../../Components/Buttons/UIBtn";
import ImageUpload from "../../Components/ImageUpload/ImageUpload";
import InputField from "../../Components/InputField/InputField";
import Spinner from "../../Components/LoadingSpinner/LoadingSpinner";

import password from "../../images/password-icon.svg";
import back from "../../images/back-icon.svg";
import deleteicon from "../../images/delete-icon.svg";

import styles from "../../Styles/Containers/UpdateProfile/UpdateProfile.module.css";

const UpdateProfile = () => {
    //Auth context
    const auth = useContext(AuthContext);
    //History
    const history = useNavigate();
    //Window size
    const { width } = useWindowDimension();
    //Backend request hook
    const { isLoading, error, sendRequest, clearError } = useHttpRequest();
    //Profile state
    const [userDataState, setUserDataState] = useState();
    //Delete message state
    const [showInfo, setShowInfo] = useState(false);
    //Confirm modal state
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    //Form useState
    const [formState, inputHandler, setFormState] = useForm(
        {
            image: {
                value: null,
                isValid: false
            },
            firstName: {
                value: "",
                isValid: false
            },
            lastName: {
                value: "",
                isValid: false
            },
            username: {
                value: "",
                isValid: false
            },
            role: {
                value: "",
                isValid: false
            },
            email: {
                value: "",
                isValid: false
            },
            password: {
                value: "",
                isValid: false
            }
        },
        false
    );
    //Fetch
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await sendRequest(
                    `http://localhost:5000/user/${auth.userId}`, "GET", null, {Authorization: "Bearer " + auth.token}
                );
                setUserDataState(userData);
                setFormState(
                    {
                        image: {
                            value: userData.photo_url,
                            isValid: false,
                        },
                        firstName: {
                            value: userData.firstname,
                            isValid: true,
                        },
                        lastName: {
                            value: userData.lastname,
                            isValid: true,
                        },
                        username: {
                            value: userData.username,
                            isValid: true,
                        },
                        role: {
                            value: userData.role,
                            isValid: true,
                        },
                        email: {
                            value: userData.email,
                            isValid: true,
                        }
                    },
                    true
                );
            } catch (err) {}
        };
        fetchUser();
    }, [sendRequest, auth.userId, auth.token, setFormState]);

    //Mise à jour des données utilisateur
    const updateProfileHandler = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("image", formState.inputs.image.value);
        formData.append("firstName", formState.inputs.firstName.value);
        formData.append("lastName", formState.inputs.lastName.value);
        formData.append("username", formState.inputs.username.value);
        formData.append("email", formState.inputs.email.value);
        try {
            await sendRequest("http://localhost:5000/user/update", "PATCH", formData, {
                Authorization: "Bearer " + auth.token,
            });

            openConfirmModalHandler();
        } catch (err) {}
    };

    // Mettre à jour le mot de passe utilisateur
    const updatePasswordHandler = async (event) => {
        event.preventDefault();

        try {
            await sendRequest(
                "http://localhost:5000/user/update",
                "PUT",
                JSON.stringify({
                    password: formState.inputs.password.value,
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );

            // écran de confirmation
            openConfirmModalHandler();
        } catch (err) {}
    };

    //  Intention de Supprimer utilisateur
    const showDeleteMessage = (event) => {
        event.preventDefault();
        if (showInfo === false) {
            setShowInfo(true);
        } else {
            setShowInfo(false);
        }
    };

    //  Supprimer utilisateur
    const deleteUserHandler = async (event) => {
        event.preventDefault();

        try {
            await sendRequest(`http://localhost:5000/user/${auth.userId}`, "DELETE", null, {
                "Content-Type": "application/json",
                Authorization: "Bearer " + auth.token,
            });
            auth.logout();
            history(`/`);
        } catch (err) {}
    };

     //  Fonctions écran de confirmation
     const openConfirmModalHandler = () => {
        setShowConfirmModal(true);
    };

    const closeConfirmModalHandler = () => {
        setShowConfirmModal(false);
        setTimeout(() => {
            history(`/profile/${auth.userId}`);
        }, 300);
    };

    //  Affichage Nav desktop
    let desktopNav;

    let btnStyle = styles.btnStyle;
    let iconStyle = `${styles.iconStyle} icon_red`;

    if (width >= 1024) {
        desktopNav = (
            <NavBtn id="back" name="Retourner" icon={back} link={`/user/${auth.userId}`} btnStyle={btnStyle} iconColor={iconStyle} />
        );
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

    if (!userDataState) {
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
            <ComfirmModal show={showConfirmModal} message="Profil mis à jour" onCancel={closeConfirmModalHandler} />
            <div className={`container ${styles.class_mod}`}>
                {!isLoading && userDataState && (
                    <div className={styles.wrapper}>
                        <div className={styles.background_img}></div>
                        <ImageUpload center id="image" onInput={inputHandler} errorText="Choisissez une image" photo_url={userDataState.photo_url} />
                        <h4 className={styles.title}>Vos infos personnelles</h4>
                        {desktopNav}
                        <form id="update-form" className={styles.update_list} onSubmit={updateProfileHandler}>
                            <InputField id="firstName" label="Prénom :" name="firstName" type="text" placeholder="Votre prénom" autocomplete="given-name" maxLength="45" element="input" hasLabel="yes" textIsWhite="no" validators={[MinLength(2), MaxLength(45), isText()]} errorText="Veuillez entrer un prénom" onInput={inputHandler} initialValue={userDataState.firstName} initialValid={true} />
                            <InputField id="lastName" label="Nom :" name="lastName" type="text" placeholder="Votre nom" autocomplete="family-name" maxLength="45" element="input" hasLabel="yes" textIsWhite="no" validators={[MinLength(2), MaxLength(45), isText()]} errorText="Veuillez entrer un nom" onInput={inputHandler} initialValue={userDataState.lastName} initialValid={true} />
                            <InputField id="username" label="Nom d'utilisateur :" name="username" type="text" placeholder="Votre nom d'utilisateur" autocomplete="nickname" maxLength="45" element="input" hasLabel="yes" textIsWhite="no" validators={[MinLength(2), MaxLength(45), isText()]} errorText="Veuillez entrer un nom d'utilisateur" onInput={inputHandler} initialValue={userDataState.username} initialValid={true} />
                            <InputField id="email" label="Email :" name="email" type="text" placeholder="Votre email" autocomplete="email" maxLength="100" element="input" hasLabel="yes" textIsWhite="no" validators={[MinLength(6), MaxLength(100), isEmail()]} errorText="email incorrect" onInput={inputHandler} initialValue={userDataState.email} initialValid={true} />
                        </form>
                        <UIBtn id="update-profile-btn" form="update-form" name="Mettre à jour mon profil" type="submit" btnType="valid" />
                        <h4 className={styles.title}>Changer mon mot de passe</h4>
                        <form id="update-password-form" className={styles.update_list} onSubmit={updatePasswordHandler}>
                        <InputField id="password" label="Mot de passe :" name="password" type="password" placeholder="Votre nouveau pot de passe" icon={password} alt="password icon" maxLength="50" element="input" hasLabel="yes" textIsWhite="no" validators={[MinLength(8), MaxLength(50)]} errorText="Minimum une majuscule, un chiffre et 8 lettres" onInput={inputHandler} initialValue={formState.inputs.password.value} initialValid={formState.inputs.password.isValid} />
                        </form>
                        <UIBtn id="update-password-btn" form="update-password-form" name="changer mon mot de passe" type="submit" btnType="valid" />
                        <h4 className={styles.title}>Supprimer mon compte</h4>
                        <UIBtn id="delete-profile-btn" icon={deleteicon} name="Supprimer" onClick={showDeleteMessage} btnType="warning" iconColor="icon_white" />
                        <div style={{ display: showInfo === true ? "block" : "none" }}>
                            <p className={styles.role}>
                                Vous êtes sur le point de supprimer votre compte. Toutes les informatios liées à ce comptes seront définitivement supprimées.
                            </p>
                            <h5 className={styles.title}>Êtes-vous sûr de vouloir supprimer votre compte ?</h5>
                            <div className={styles.btn_block}>
                                <UIBtn id="accept-btn" name="Oui" type="submit" onClick={deleteUserHandler} btnType="warning" />
                                <UIBtn id="cancel-btn" name="Annuler" onClick={showDeleteMessage} btnType="cancel" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default UpdateProfile;