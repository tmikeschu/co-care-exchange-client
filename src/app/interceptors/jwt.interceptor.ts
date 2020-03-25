import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from '../services/auth/user.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const TOKEN_HEADER_KEY = 'x-api-key';

    console.log('here');
    const authReq = request.clone({headers: request.headers.set(TOKEN_HEADER_KEY, 'KmFXIagDOypuL6YtCMzuaOyhs9cFodW2n6MK1eS1')});
    return next.handle(authReq);
  }
}
