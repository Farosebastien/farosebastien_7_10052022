import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
    //UseState de AuthContext
    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(false);
    const [account, setAccount] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState(false);

    //Login useCallback pour ne pas faire un cycle infinit
    const login = useCallback((userId, token, account, expirationDate) => {
        setUserId(userId);
        setToken(token);
        setAccount(account);

        //Créer une date de validité de session (durée de 24h)
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
        setTokenExpirationDate(tokenExpirationDate);

        //Envoie des paramètres dans le localstorage
        localStorage.setItem("userData", JSON.stringify({userId: userId, token: token, account: account, expiration: tokenExpirationDate.toISOString()}));
    }, []);

    //Logout (remise à zéro de toutes les const et suppression du localstorage)
    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setAccount(null);
        setTokenExpirationDate(null);
        localStorage.removeItem("userData");
    }, []);

    //Timer de session
    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() -  new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    //Autologin en utilisant les données du localstorage
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (storedData && storedData.userId && storedData.token && storedData.account && new Date(storedData.expiration) > new Date()) {
            login(storedData.userId, storedData.token, storedData.account, new Date(storedData.expiration));
        }
    }, [login]);

    return { userId, token, account, login, logout };
}