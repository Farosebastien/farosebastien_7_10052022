import React from "react";
import Modal from "../Modal/Modal";
import UIBtn from "../Buttons/UIBtn";

import ok from "../../images/ok-icon.svg";

import styles from "../../Styles/Components/ConfirmModal/ConfirmModal.css";

const ConfirmModal = (props) => {
    return (
        <Modal 
            show={props.show} 
            onCancel={props.onCancel}
            footer={
                <UIBtn id="accept-btn" name="ok" type="submit" btnType="warning" onClick={props.onCancel} buttonClass={styles.btn} />
            }
        >
            <img className={`${styles.okIcon} icon_green`} src={ok} alt="" />
            <p>{props.message}</p>
        </Modal>
    );
};

export default ConfirmModal;