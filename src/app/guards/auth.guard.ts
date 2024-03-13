import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';

import { tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

export const canMatch: CanMatchFn = () => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);
  return usuarioService.validarToken().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) router.navigateByUrl('/login');
    })
  );
};

export const AuthGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  return usuarioService.validarToken().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigateByUrl('/login');
      }
    })
  );
};
