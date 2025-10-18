import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {
private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}specializations`;

  constructor(private http: HttpClient) {}

  public getAllSpecialization(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  addSpecialization(specializations: any): Observable<any> {
    return this.http.post<any>(this.href, specializations);
  }

  public deleteSpecialization(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public unblockSpecialization(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}unBlockSpecialization/${id}`);
  }

 public updateSpecialization(user:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,user)
  }

}
