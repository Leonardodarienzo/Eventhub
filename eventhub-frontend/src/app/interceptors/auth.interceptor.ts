import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user?.token) {
    const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${user.token}` } });
    return next(authReq);
  }
  return next(req);
};
