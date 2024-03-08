import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hospital } from 'src/models/hospital.model';
import { Medico } from 'src/models/medico.models';
import { Usuario } from 'src/models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    //Metodo para Generar una instancia de mi modelo de usuarios, para mostrar las imagenes en la tabla de busquedas
    return resultados.map(
      (user) =>
        new Usuario(
          user.nombre,
          user.email,
          '',
          user.img,
          user.google,
          user.role,
          user.uid
        )
    );
  }
  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados;
  }
  private transformarMedicos(resultados: any[]): Medico[] {
    return resultados;
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string = '') {
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers).pipe(
      map((resp: any) => {
        switch (tipo) {
          case 'usuarios':
            return this.transformarUsuarios(resp.resultados);
          case 'hospitales':
            return this.transformarHospitales(resp.resultados);
          case 'medicos':
            return this.transformarMedicos(resp.resultados);

          default:
            return [];
        }
      })
    );
  }
}
