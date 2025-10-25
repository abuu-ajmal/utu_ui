import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

 private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}identities`;

  constructor(private http: HttpClient) {}

  public getAllIdentity(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  addIdentity(Identitys: any): Observable<any> {
    return this.http.post<any>(this.href, Identitys);
  }

  public deleteIdentity(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public unblockIdentity(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}unBlockIdentity/${id}`);
  }

 public updateIdentity(user:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,user)
  }

}
