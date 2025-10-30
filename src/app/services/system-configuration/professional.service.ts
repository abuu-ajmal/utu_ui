import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {

  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}professional-titles`;

  constructor(private http: HttpClient) {}

  public getAllProfessional(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  addProfessional(professional: any): Observable<any> {
    return this.http.post<any>(this.href, professional);
  }

  public deleteProfessional(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public unblockProfessional(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}unBlockProfessional/${id}`);
  }

 public updateProfessional(user:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,user)
  }

   public getProfessionalById(id:number){
    return this.http.get(`${this.baseUrl}services/by-professional/${id}`);
  }

}
