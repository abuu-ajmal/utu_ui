import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlotService {

 private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}time-slots`;
   private set_href = `${this.baseUrl}time/availabilities`;

  constructor(private http: HttpClient) {}

  public getAllSlots(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  addSlots(Slotss: any): Observable<any> {
    return this.http.post<any>(this.href, Slotss);
  }

  public deleteSlots(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }


  //check available slots for proffessional



  // Fetch slots for a professional
  getAvailabilities(): Observable<any> {
    return this.http.get(`${this.set_href}`);
  }

  // Add multiple slots
  // setSlots(data: { slot_id: number[]; professional_id: number }): Observable<any> {
  //   return this.http.post(`${this.set_href}`, data);
  // }

   public deleteAvailableSlots(id:any): Observable<any>{
    return this.http.delete(`${this.set_href}/${id}`);
  }

  setSlots(payload: any): Observable<any> {
  return this.http.post<any>(this.set_href, payload);
}




}

