import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {

  // private baseUrl='http://localhost:8000'; // ===> backend1 url
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAllStudents(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
  
    return this.http.get<any[]>(`${this.baseUrl}`, { headers });
  }
  

  createStudent(student: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/create`, student);
  }

  updateStudent(roll_no: number, student: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${roll_no}`, student);
  }

  deleteStudents(student: any[]): Observable<any> {
    return this.http.request<any>('delete', `${this.baseUrl}/delete`, { body: student });
  }

}
