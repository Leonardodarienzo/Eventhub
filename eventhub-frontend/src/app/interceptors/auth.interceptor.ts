import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const user = JSON.parse(localStorage.getItem('user_session') || 'null');
  if (user?.access_token) {
    const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${user.access_token}` } });
    return next(authReq);
  }
  return next(req);
};
