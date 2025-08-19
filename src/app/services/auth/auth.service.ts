import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private router:Router) { }

  signin(userCreds:any): Observable<any> {       
    return this.http.post<any>(`${this.apiBaseUrl}/auth/login`, userCreds);
  }
  signout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
