import React, { useState, useEffect } from "react";
import {  useLocation } from "react-router-dom";
import Image from "../../images/image-icon.svg";
import GenProfile from "../../images/generic_profile_picture.jpg";

import styles from "./ImageUpload.module.css";


const ImageUpload = (props) => {
    //Image
    const [file, setFile] = useState();
    //Prévisualisation de l'image
    const [previewUrl, setPreviewUrl] = useState();
    //Validation
    const [isValid, setIsValid] = useState(false);
    //Localisation actuelle
    const path = useLocation().pathname;

    useEffect(() => {
        //Si il n'y a pas d'image
        if (!file) {
            return;
        }
        //Prévisualisation et envoi au useState
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickedImageHandler = (event) => {
        let pickedFile;
        let fileIsValid = isValid;

        //Si il y a une image
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    //Si la page est newpost
    if (path === "/post/new") {
        return (
            <>
                <label htmlFor="upload-button" className={styles.image_container}>
                    {previewUrl ? (
                        <>
                            <img className={styles.preview_post} src={previewUrl} alt="Prévisualisation" />
                            <div className={styles.red_banner_post}>
                                <span className={styles.banner_text_post}>changer l'image</span>
                            </div>
                        </>
                    ) : (
                            <div className={styles.icon_block}>
                                <img className={styles.icon} src={Image} alt="" />
                                <span className={styles.text}>Veuillez choisir une image</span>
                            </div>
                    )}
                </label>
                <input type="file" accept=".jpeg,.jpg,.gif" id="upload-button" style={{ display: "none" }} onChange={pickedImageHandler} />
            </>
        );
    }

    //Page update profile
    return (
        <>
            <label htmlFor="upload-button" className={styles.photo_container}>
                {previewUrl ? (
                    <>
                        <img className={styles.preview_img} src={previewUrl} alt="Prévisualisation du profil" />

                        <div className={styles.red_banner}>
                            <span className={styles.banner_text}>changer</span>
                        </div>
                    </>
                ) : (
                    <div>
                        <img className={styles.profile_photo} src={props.photo_url || GenProfile} alt="" />
                        <div className={styles.red_banner}>
                            <span className={styles.banner_text}>changer</span>
                        </div>
                    </div>
                )}
            </label>
            <input type="file" accept=".jpeg,.jpg" id="upload-button" style={{ display: "none" }} onChange={pickedImageHandler} />
        </>
    );
};

export default ImageUpload;