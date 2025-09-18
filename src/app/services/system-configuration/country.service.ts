import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CountryService {


  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}countries`;

  constructor(private http: HttpClient) {}

  public getAllCountry(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public getCountries(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getCountries`);
  }

  public deleteCountry(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public unblockCounty(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}unBlockCountry/${id}`);
  }
}
