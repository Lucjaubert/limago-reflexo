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
    return this.http.get<any>(`${this.apiUrl}/whoami`);
  }

  getReflexology(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reflexology`);
  }

  getServices(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/services`);
  }

  getReservation(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reserve`);
  }

  postReservationDetails(details: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-reservation`, details);
  }

  getPageById(pageId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pages/${pageId}`);
  }

  getLegalNotices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/legal`);
  }

  getPrivacyPolicy(): Observable<any> {
    return this.http.get(`${this.apiUrl}/privacy`);
  }

  getTermsConditions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/terms`);
  }
}
