import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../Hooks/formHook";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { AuthContext } from "../../Context/authContext";
import { isEmail, MinLength } from "../../Utils/validators";

import logo from "../../images/logo.png";
import password from "../../images/password-icon.svg";
import person from "../../images/person-icon.svg";

import InputField from "../../Components/InputField/InputField";

import "../Home/Home.css";

const Login = () => {
    //Authentification Context
    const auth = useContext(AuthContext);
    //History Context
    const history = useNavigate();
    //Request Hook
    const { error, sendRequest } = useHttpRequest();
    //Input Hook
    const [formState, inputHandler] = useForm(
        {
            email: {
                value: "",
                isValid: false
            },
            password: {
                value: "",
                isValid: false
            },
        },
        false
    );
    const forgottenPassword = (event) => {
        event.preventDefault();
        window.location.href = "mailto:clemence@groupmania.fr"
    }

    const loginHandler = async (event) => {
        event.preventDefault();

        if(!formState.isValid) {
            return;
        }

        try {
            const data = {
                email: formState.inputs.email.value,
                password: formState.inputs.password.value
            };

            const responseData = await sendRequest(`${process.env.REACT_APP_API_URL}/login`, "POST", JSON.stringify(data), { "Content-Type": "application/json"});
            auth.login(responseData.userId, responseData.token, responseData.account);
            history("/post");
        } catch (err) {}
    };

    return (
        <>
            <div className="background_image">
                <img src={logo} className="logo" alt="logo de Groupomania" />
                <form id="login-form" className="input_list" onSubmit={loginHandler}>
                    <InputField id="email" name="email" type="email" onInput={inputHandler} placeholder="email" autocomplete="email" icon={person} alt="email-icon" element="input" hasLabel="no" textIsWhite="yes" validators={[isEmail(), MinLength(6)]} errorText="Email invalide" initialValue={formState.inputs.email.value} initialValid={formState.inputs.email.isValid} />
                    <InputField id="password" name="password" type="password" onInput={inputHandler} placeholder="mot de passe" autocomplete="current-password" icon={password} alt="password icon" hasLabel="no" textIsWhite="yes" validators={[MinLength(8)]} errorText="Mot de passe incorrect" initialValue={formState.inputs.password.value} initialValid={formState.inputs.password.isValid} />
                </form>
                <p className="error_message">{error}</p>
                <Link className="forgot_pass_link" to={"/login"} onClick={forgottenPassword}>Mot de passe oublié ?</Link>
            </div>
            <div className="background_blur"></div>
        </>
    );
};

export default Login;