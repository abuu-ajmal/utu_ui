import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProffService {

private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}professionals`;

  constructor(private http: HttpClient) {}

  public getAllProffessional(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  addProffessional(Proffessionals: any): Observable<any> {
    return this.http.post<any>(this.href, Proffessionals);
  }

  public deleteProffessional(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public unblockProffessional(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}unBlockProffessional/${id}`);
  }

 public updateProffessional(professionalId: number, formData: FormData){
    return this.http.post(`${this.href}/update/${professionalId}`,formData);
  }

}
