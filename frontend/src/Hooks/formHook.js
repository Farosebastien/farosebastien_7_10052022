import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
    //Evenement
    switch (action.type) {
        case "INPUT_CHANGE":
            let formIsValid = true;
            for (const inputId in state.inputs) {
                if (!state.inputs[inputId]) {
                    continue;
                }
                if (inputId === action.inputId) {
                    formIsValid =  action.isValid;
                } else {
                    formIsValid =  state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {value: action.value, isvalid: action.isValid },
                },
                isValid: formIsValid
            };
        case "SET_DATA":
            return {
                inputs: action.inputs,
                isValid: action.formIsValid
            };
        default:
            return state;
    }
};

export const useForm = (initialInputs, initialFormValidity) => {
    //Etablir les données initiales des objets html et envoi à formState
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity
    });

    //Capture des données des objets html et envoi à formState
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: "INPUT_CHANGE",
            value: value,
            isValid: isValid,
            inputId: id
        });
    }, []);

    //Réinitialiser les données des objets html et envoi à formState
    const setFormState = useCallback((inputData, formValidity) => {
        dispatch({
            type: "SET_DATA",
            inputs: inputData,
            formIsValid: formValidity,
        });
    }, []);

    return [formState, inputHandler, setFormState];
};