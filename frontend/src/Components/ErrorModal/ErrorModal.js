import React from "react";

import Modal from "./../Modal/Modal";
import UIBtn from "./../Buttons/UIBtn/UIBtn";

import styles from "./ErrorModal.module.css";

const ErrorModal = (props) => {
    return (
        <Modal onCancel={props.onClear} header="An Error Occured!" show={!!props.error} footer={<UIBtn id="accept-btn" name="Ok" type="submit" onClick={props.onClear} buttonClass={styles.btn} />}>
            <p>{props.error}</p>
        </Modal>
    );
};

export default ErrorModal;