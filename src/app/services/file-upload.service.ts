import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string
  ) {

    try {
      
      const url = `${ base_url }/upload/${tipo}/${id}`;
      //Para preparar la data que necesitamos enviar al backend usamos FormData que es propio de JS y es una manera de enviar informacion al backend mediante la peticion fetch
      const formData = new FormData();
      formData.append('imagen', archivo);

      // Hacemos la peticion y la almacenamos en una variable llamada resp
      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      if ( data.ok ) {
        return data.nombreArchivo;
      } else {
        console.log(data.msg);
        return false;
      }

    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
