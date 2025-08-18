import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MistralApiService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  subirArchivoRemito(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<any>(`${this.apiBaseUrl}/api/process-invoice`, formData);
  }

  procesarRemito(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('invoice', archivo);
    return this.http.post<any>(`${this.apiBaseUrl}/api/process-invoice`, formData);
  }

  procesarMultiplesRemitos(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/api/process-invoices`, formData);
  }
}


