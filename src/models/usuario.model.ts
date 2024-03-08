/*          "nombre": "miguel escalante",
            "email": "migue@mail.com",
            "role": "USER_ROLE",
            "google": false,
            "img": "0c11f29c-6b28-432d-b932-7af96bac6984.jpg",
            "uid": "6578aa9e13855925d679a44c" 
 */

import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: string,
    public uid?: string
  ) {}

  get imagenUrl() {
    //localhost:2470/api/upload/usuarios/no-image

    if (!this.img) {
      return `${base_url}/upload/usuarios/no-image`;
    } else if (this.img?.includes('https')) {
      return this.img;
    } else if (this.img) {
      return `${base_url}/upload/usuarios/${this.img}`;
    } else {
      return `${base_url}/upload/usuarios/no-image`;
    }
  }
}
