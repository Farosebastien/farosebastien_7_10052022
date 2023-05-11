import { useState, useEffect } from "react";

//Fonction de récupération des dimensions de la fenêtre
function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

//Hook pour récupérer les dimensions
export const useWindowDimension = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    //UseEffect si on a un event resize
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowDimensions;
}