import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacilityservicesService {

 private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}facility-services`;

  constructor(private http: HttpClient) {}

  public getAllFacilityServices(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  addFacilityServices(Services: any): Observable<any> {
    return this.http.post<any>(this.href, Services);
  }

  public deleteFacilityServices(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public unblockFacilityServices(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}unBlockFacilityServices/${id}`);
  }

 public updateFacilityServices(user:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,user)
  }

   public getFacilityServicesById(id:number){
    return this.http.get(`${this.baseUrl}services/by-Services/${id}`);
  }

}
