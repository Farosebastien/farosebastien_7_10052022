import React from "react";

import logotype from "../../images/logotype.svg";

import styles from "./Counter.module.css";

const Counter = (props) => {
    return (
        <div className={styles.block}>
            <div className={styles.counter}>
                <h5 className={styles.title}>Publications</h5>
                <span className={styles.count}>{props.postsCount}</span>
                <p className={styles.text}>par vous</p>
            </div>
            <img className={styles.logotype} src={logotype} alt="logo de Groupomania" />
            <div className={styles.counter}>
                <h5 className={styles.title}>Aimées par</h5>
                <span className={styles.count}>{props.likesCount}</span>
                <p className={styles.text}>vos collègues</p>
            </div>
        </div>
    );
};

export default Counter;