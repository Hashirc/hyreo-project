import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // For mock mode or when user is not authenticated, just pass through
    const currentUser = this.authService.currentUser();
    
    if (!currentUser) {
      return next.handle(req);
    }

    // In a real Firebase setup, you would get the token here
    // For now, we'll just add a mock token
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer mock-token`
      }
    });

    return next.handle(clonedReq);
  }
}
