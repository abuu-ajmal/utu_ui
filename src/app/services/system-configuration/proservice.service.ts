import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProserviceService {

 private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}services`;

  constructor(private http: HttpClient) {}

  public getAllServices(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  addServices(Services: any): Observable<any> {
    return this.http.post<any>(this.href, Services);
  }

  public deleteServices(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public unblockServices(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}unBlockServices/${id}`);
  }

 public updateServices(user:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,user)
  }

   public getServicesById(id:number){
    return this.http.get(`${this.baseUrl}services/by-Services/${id}`);
  }

}
