import React, { useContext } from "react";
import { useForm } from "../../Hooks/formHook";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { isEmail, MinLength, isText } from "../../Utils/validators";

import logo from "../../images/logo.png";
import lastname from "../../images/lastname-icon.svg";
import password from "../../images/password-icon.svg";
import person from "../../images/person-icon.svg";
import email from "../../images/email-icon.svg";

import InputField from "../../Components/InputField/InputField";

import "../../Styles/Containers/Home/Home.css";
import styles from "../../Styles/Containers/Signup/Signup.module.css";

const SignUp = () => {
    //Auth context
    const auth = useContext(AuthContext);
    //History
    const history = useNavigate();
    const [formState, inputHandler] = useForm(
        {
            firstname: {
                value: "",
                isValid: false
            },
            lastname: {
                value: "",
                isValid: false
            },
            username: {
                value: "",
                isValid: false
            },
            email: {
                value: "",
                isValid: false
            },
            password: {
                value: "",
                isValue: false
            },
        },
        false
    );
    //Request hook
    const { error, sendRequest } = useHttpRequest();

    const signupHandler = async (event) => {
        event.preventDefault();

        if(!formState.isValid) {
            return;
        }

        try {
            console.log(formState)
            const data = {
                firstname: formState.inputs.firstname.value,
                lastname: formState.inputs.lastname.value,
                username: formState.inputs.username.value,
                email: formState.inputs.email.value,
                password: formState.inputs.password.value
            };
            console.log(JSON.stringify(data))
            const responseData = await sendRequest("http://localhost:5000/signup", "POST", JSON.stringify(data), {
                "Content-Type": " application/json"
            });
            auth.login(responseData.userId, responseData.token, responseData.account);
            history("/post");
        } catch (err) {}
    };

    return (
        <>
            <div className="background_image">
                <img src={logo} className="logo" alt="logo de Groupomania" />
                <form id="signup-form" className={styles.input_list} onSubmit={signupHandler}>
                    <InputField id="firstname" name="firstname" type="text" placeholder="prénom" autocomplete="given-name" icon={person} alt="first name icon" element="input" hasLabel="no" textIsWhite="yes" validators={[MinLength(2), isText()]} errorText="Veuillez entrer uniquement des lettres" onInput={inputHandler} initialValue={formState.inputs.firstname.value} initialValid={formState.inputs.firstname.isValid} />
                    <InputField id="lastname" name="lastname" type="text" placeholder="nom" autocomplete="family-name" icon={lastname} alt="last name icon" element="input" hasLabel="no" textIsWhite="yes" validators={[MinLength(2), isText()]} errorText="Veuillez entrer uniquement des lettres" onInput={inputHandler} initialValue={formState.inputs.lastname.value} initialValid={formState.inputs.lastname.isValid} />
                    <InputField id="username" name="username" type="text" placeholder="nom d'utilisateur" autocomplete="nickname" icon={person} alt="nickname icon" element="input" hasLabel="no" textIsWhite="yes" validators={[MinLength(2), isText()]} errorText="Veuillez entrer uniquement des lettres" onInput={inputHandler} initialValue={formState.inputs.username.value} initialValid={formState.inputs.username.isValid} />
                    <InputField id="email" name="email" type="email" placeholder="email" autocomplete="email" icon={email} alt="email icon" element="input" hasLabel="no" textIsWhite="yes" validators={[isEmail(), MinLength(6)]} errorText="email incorrect" onInput={inputHandler} initialValue={formState.inputs.email.value} initialValid={formState.inputs.email.isValid} />
                    <InputField id="password" name="password" type="password" placeholder="mot de passe" autocomplete="current-password" icon={password} alt="password icon" element="input" hasLabel="no" textIsWhite="yes" validators={[MinLength(8)]} errorText="Minimum 1 majuscule, 1 chiffre et 8 lettres" onInput={inputHandler} initialValue={formState.inputs.password.value} initialValid={formState.inputs.password.isValid} />
                </form>
                <p className="error_message">{error}</p>
            </div>
            <div className="background_blur"></div>
        </>
    );
};

export default SignUp;