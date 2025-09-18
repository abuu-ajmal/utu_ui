import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}

  loginAuthenticate(data: any): Observable<any> {
    const href = `${this.baseUrl}login`;
    return this.http.post<any>(href, data);
  }

  public setPermissions(permissions: []) {
    localStorage.setItem('permissions', JSON.stringify(permissions));
  }

  public getPermissions(): [] {
    return JSON.parse(localStorage.getItem('permissions')!);
  }

  private hasRefreshed = false;

  shouldRefresh(): boolean {
    return !this.hasRefreshed;
  }

  markRefreshed(): void {
    this.hasRefreshed = true;
    setTimeout(() => {
      location.reload();
    }, 300);
  }
}
