/*          "nombre": "miguel escalante",
            "email": "migue@mail.com",
            "role": "USER_ROLE",
            "google": false,
            "img": "0c11f29c-6b28-432d-b932-7af96bac6984.jpg",
            "uid": "6578aa9e13855925d679a44c" 
 */

export class Usuario {

    constructor (
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: string,
        public uid?: string, 
    ) {}
}