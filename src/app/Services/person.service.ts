import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor() { }
  baseUrl= "https://localhost:7278"
  httpClient = inject(HttpClient);
  
  getUsersData(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/Employees`);
  }
}
