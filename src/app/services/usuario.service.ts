import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';

// Lo declaramos aca para poder usar el objeto global que nos ofrece google en la instalacion que hicimos en el index
declare const google: any;

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient,
               private router: Router ) { }

  logout() {
    localStorage.removeItem('token');

    // Para borrar el usuario de google con el que hizo el login
    google.accounts.id.revoke('miguelgervis1@gmail.com', () => {
      
      this.router.navigateByUrl('/login');
    });
  }

  crearUsuario( formData: RegisterForm ) {
    
    // Como es una peticion post necesito enviar la data como el segundo argumento (formData)
    return this.http.post(`${ base_url }/usuarios`, formData)
            .pipe(
              tap( (resp: any) => {
                // Grabamos el token en la localStorage
                localStorage.setItem('token', resp.token )
              })
            );
  }

  loginUsuario( formData: LoginForm ) {
    
    return this.http.post(`${ base_url }/login`, formData)
            .pipe(
              tap( (resp: any) => {
                // Grabamos el token en la localStorage
                localStorage.setItem('token', resp.token )
              })
            );
  }

  loginGoogle( token: string) {
    return this.http.post(`${ base_url }/login/google`, { token })
      .pipe(
        tap( (resp: any) => {
          // Grabamos el token en la localStorage
          // console.log('desde el service',resp)
          localStorage.setItem('token', resp.token )
        })
      )
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    
    return this.http.get(`${ base_url }/login/renew-jwt`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        //Renovamos el token que viene en la resp
        localStorage.setItem('token', resp.token )
      }),
      // Con el operador map transformamos la resp en un valor booleano
      map( resp => true),
      //Manejo del Error
      catchError( error => of(false) )
    );
  }
}
