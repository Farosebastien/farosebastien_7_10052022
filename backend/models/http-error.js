//Création d'un objet erreur
class HttpError extends Error {
    constructor(message, errorCode) {
        //ajout du message
        super(message);
        //ajout du code http
        this.code = errorCode;
    }
}

module.exports = HttpError;