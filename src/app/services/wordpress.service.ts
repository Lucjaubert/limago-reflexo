import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {
  private apiUrl = 'https://limago-reflexo.fr/wp-json/limago-reflexo/v1';

  constructor(private http: HttpClient) { }

  getHomepage(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/homepage`);
  }

  getWhoAmI(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/qui-suis-je`);
  }

  getReflexology(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reflexologie`);
  }

  getServices(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/prestations`);
  }

  getReservationInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reserver-un-soin`);
  }

  postReservationDetails(details: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-reservation`, details);
  }

  getPageById(pageId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pages/${pageId}`);
  }
}
