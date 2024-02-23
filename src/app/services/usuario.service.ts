import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from 'src/models/usuario.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';

// Lo declaramos aca para poder usar el objeto global que nos ofrece google en la instalacion que hicimos en el index
declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario!: Usuario;

  constructor(private http: HttpClient, private router: Router) {}

  // Nos creamos un getter para tener acceso al token y no repetir el codigo
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  logout() {
    localStorage.removeItem('token');

    // Para borrar el usuario de google con el que hizo el login
    google.accounts.id.revoke('miguelgervis1@gmail.com', () => {
      this.router.navigateByUrl('/login');
    });
  }

  crearUsuario(formData: RegisterForm) {
    // Como es una peticion post necesito enviar la data como el segundo argumento (formData)
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        // Grabamos el token en la localStorage
        localStorage.setItem('token', resp.token);
      })
    );
  }

  actualizarPerfil(data: { email: string; nombre: string; role: any }) {
    //Para cumpliar con las validaciones tenemos que enviar el role tambien en la data a la peticion
    data = {
      ...data,
      role: this.usuario.role,
    };

    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      data,
      this.headers
    );
  }

  loginUsuario(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        // Grabamos el token en la localStorage
        localStorage.setItem('token', resp.token);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        // Grabamos el token en la localStorage
        // console.log('desde el service',resp)
        localStorage.setItem('token', resp.token);
      })
    );
  }

  validarToken(): Observable<boolean> {
    //Resolver error //[GSI_LOGGER]: Attemp to call revoke() before initialize()
    google.accounts.id.initialize({
      client_id:
        '85631883213-g23grlean480rikei8v2vrjtq6vhratj.apps.googleusercontent.com',
    });

    return this.http
      .get(`${base_url}/login/renew-jwt`, {
        headers: {
          'x-token': this.token, //accedemos al token mediante el getters creado, para enviarlo en el header
        },
      })
      .pipe(
        tap((resp: any) => {
          // console.log(resp)

          // Desestructuramos de la resp que viene del servicio el objeto UsuarioDB
          const { email, google, nombre, role, img, uid } = resp.usuarioDB;

          // Creamos una nueva instancia de mi modelo Usuario almacenando la informacion que viene del servicio en la variable usuario
          this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

          //Renovamos el token que viene en la resp
          localStorage.setItem('token', resp.token);
        }),
        // Con el operador map transformamos la resp en un valor booleano
        map((resp) => true),
        //Manejo del Error
        catchError((error) => of(false))
      );
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuarios>(url, this.headers).pipe(
      //Usamos el delay para asegurarnos de que el loading se muestra correctamente
      delay(400),
      //Procedimiento para mostrar la img del usuario en la tabla de mantenimientos
      map((resp) => {
        const usuarios = resp.usuarios.map(
          //Creamos la instancia a nuestro models de usuarios usando el operador map
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
        return {
          total: resp.total,
          usuarios,
        };
      })
    );
  }

  eliminarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  GuardarUsuario(usuario: Usuario) {
    return this.http.put(
      `${base_url}/usuarios/${usuario.uid}`,
      usuario,
      this.headers
    );
  }
}
