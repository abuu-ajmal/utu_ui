import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EducationlevelService {

 private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}education-levels`;

  constructor(private http: HttpClient) {}

  public getAllEducationLevel(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  addEducationLevel(education: any): Observable<any> {
    return this.http.post<any>(this.href, education);
  }

  public deleteEducationLevel(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public unblockEducationLevel(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}unBlockEducationLevel/${id}`);
  }

  public updateEducationLevel(user:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,user)
  }


}
