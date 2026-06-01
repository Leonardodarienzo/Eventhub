import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = localStorage.getItem('user_session');
  
  if (session) {
    try {
      const parsed = JSON.parse(session);
      if (parsed?.access_token) {
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${parsed.access_token}` }
        });
        return next(authReq);
      }
    } catch {
      // Invalid session, continue without auth header
    }
  }
  
  return next(req);
};
