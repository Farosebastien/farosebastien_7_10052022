import React, { useReducer, useEffect } from "react";
import { validate } from "../../Utils/validators";

import styles from "./InputField.module.css"

//En fonction de l'action en cours change ou touch
const inputReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE":
            return {
                //Récupération du state
                ...state,
                //Vérification de la validité
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case "TOUCH":
            return {
                ...state,
                isTouched: true
            };
        default:
            return state;
    }
};

const InputField = (props) => {
    //Etat initial du composant
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || "",
        isTouched: false,
        isValid: props.initialValid || false
    });

    const { id, onInput } = props;
    const { value, isValid } = inputState;

    //Id, valeur et validité du composant
    useEffect(() => {
        onInput(id, value, isValid);
    }, [id, value, isValid, onInput]);

    //Fonction pour récupérer l'état d'un composant
    const changeHandler = (event) => {
        dispatch({
            type: "CHANGE",
            val: event.target.value,
            validators: props.validators
        });
    };

    const touchHandler = () => {
        dispatch({
            type: "TOUCH"
        });
    };

    //Changement de couleur en fonction de la validation
    let typeOfBox;
    let borderColor;

    if (props.texIsWhite === "yes") {
        typeOfBox = styles.white_box;
        borderColor = styles.border_white;
    } else {
        typeOfBox = styles.box;
        borderColor= "";
    }

    //Si il y a un label
    const label = props.label ? (
        <label className={styles.label} htmlFor={props.id}>
            {props.label}
        </label>
    ) : null;

    //Si icone
    let icon;

    if (props.icon && props.textIsWhite === "yes") {
        icon = <img className={`${styles.icon} icon_white`} src={props.icon} alt={props.alt} />;
    } else if (props.icon) {
        icon = <img className={styles.icon} src={props.icon} alt={props.alt} />;
    } else {
        icon = "";
    }

    //Composant input ou textarea
    const element = props.element === "input" ? (
        <input id={props.id} className={`${typeOfBox} ${styles.input_height}`} name={props.name} type={props.type} placeholder={props.placeholder} autoComplete={props.autoComplete} value={inputState.value} onChange={changeHandler} onBlur={touchHandler}></input>
    ) : (
        <input id={props.id} className={`${typeOfBox} ${styles.textarea}`} name={props.name} type={props.type} rows={props.rows || 3} placeholder={props.placeholder} autoComplete={props.autoComplete} value={inputState.value} onChange={changeHandler} onBlur={touchHandler} />
    );

    return (
        <>
            <div className={`${styles.block} ${borderColor} ${!inputState.isValid && inputState.isTouched && styles.invalid}`}>
                {label}
                <div className={styles.wrapper}>
                    {element}
                    {icon}
                </div>
            </div>
            {!inputState.isValid && inputState.isTouched && <p className={styles.input_error}>{props.errorText}</p>}
        </>
    );
};

export default InputField;