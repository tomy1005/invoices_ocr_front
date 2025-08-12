import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MistralApiService {
  // private apiKey = 'bYfERF2MsDQI4MUj1p4LGC1NMN14WXLm';
  // private apiUrl = 'https://api.mistral.ai/v1/ocr';
  private backendUrl = 'http://localhost:3000/api/process-invoice'; // Ajusta el puerto si es diferente

  constructor(private http: HttpClient) {}

  subirArchivoRemito(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<any>(this.backendUrl, formData);
  }

  procesarRemito(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('invoice', archivo);
    return this.http.post<any>('http://localhost:3000/api/process-invoice', formData);
  }

  procesarMultiplesRemitos(formData: FormData) {
    return this.http.post<any>('http://localhost:3000/api/process-invoices', formData);
  }
}
