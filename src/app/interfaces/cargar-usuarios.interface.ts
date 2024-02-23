import { Usuario } from "src/models/usuario.model";


export interface CargarUsuarios {
    total: number;
    usuarios: Usuario[];
}