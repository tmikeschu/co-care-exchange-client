import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from '../services/auth/user.service';
import {AuthenticationService} from '../services/cce/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  static TOKEN_HEADER_KEY = 'x-api-key';
  static COG_TOKEN_KEY = 'X-COG-ID';
  constructor(private authenticationService: AuthenticationService) {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const idToken = this.authenticationService.getIdToken();
    // TODO -- remove api key
    const headers = request.headers.set(JwtInterceptor.TOKEN_HEADER_KEY, 'KmFXIagDOypuL6YtCMzuaOyhs9cFodW2n6MK1eS1');
    headers.append(JwtInterceptor.COG_TOKEN_KEY, idToken);
    const authReq = request.clone({headers});
    return next.handle(authReq);
  }
}
