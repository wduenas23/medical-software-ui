import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthorizationDetail, User } from '../../model/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;

  authenticateUser(user: User): Observable<User>{
    return this.http.post<User>(`${this.baseUrl}/auth/login`,user);
  }

  isAuthenticated(): Observable<any>{
    return {} as Observable<any>;
  }

  autorizacionesPorRole(roleId: number): Observable<AuthorizationDetail[]> {
    return this.http.get<AuthorizationDetail[]>(`${this.baseUrl}/auth/byRole?roleId=${roleId}`);
  }

  constructor(private http: HttpClient) { }
}
