import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, LoginRequest, SessionInfo, Student, StudentRequest, Trainer, TrainerRequest } from './models';
@Injectable({providedIn:'root'})
export class ApiService {
  private http=inject(HttpClient); private base='http://localhost:8080/api';
  loginStudent(body:LoginRequest):Observable<Student>{return this.http.post<Student>(`${this.base}/auth/student/login`,body,{withCredentials:true});}
  loginTrainer(body:LoginRequest):Observable<Trainer>{return this.http.post<Trainer>(`${this.base}/auth/trainer/login`,body,{withCredentials:true});}
  loginAdmin(body:LoginRequest):Observable<SessionInfo>{return this.http.post<SessionInfo>(`${this.base}/auth/admin/login`,body,{withCredentials:true});}
  logout():Observable<{message:string}>{return this.http.post<{message:string}>(`${this.base}/auth/logout`,{}, {withCredentials:true});}
  session():Observable<SessionInfo>{return this.http.get<SessionInfo>(`${this.base}/auth/session`,{withCredentials:true});}
  registerStudent(body:StudentRequest):Observable<Student>{return this.http.post<Student>(`${this.base}/students/register`,body,{withCredentials:true});}
  registerTrainer(body:TrainerRequest):Observable<Trainer>{return this.http.post<Trainer>(`${this.base}/trainers/register`,body,{withCredentials:true});}
  studentMe():Observable<Student>{return this.http.get<Student>(`${this.base}/students/me`,{withCredentials:true});}
  trainerMe():Observable<Trainer>{return this.http.get<Trainer>(`${this.base}/trainers/me`,{withCredentials:true});}
  trainers():Observable<Trainer[]>{return this.http.get<Trainer[]>(`${this.base}/trainers/available`,{withCredentials:true});}
  myStudents():Observable<Student[]>{return this.http.get<Student[]>(`${this.base}/trainers/my-students`,{withCredentials:true});}
  students():Observable<Student[]>{return this.http.get<Student[]>(`${this.base}/students`,{withCredentials:true});}
  searchStudents(query:string):Observable<Student[]>{return this.http.get<Student[]>(`${this.base}/students/search`,{params:{q:query},withCredentials:true});}
  reindexStudentSearch():Observable<{message:string; indexedCount:number}>{return this.http.post<{message:string; indexedCount:number}>(`${this.base}/students/search/reindex`,{}, {withCredentials:true});}
  courses():Observable<Course[]>{return this.http.get<Course[]>(`${this.base}/courses`,{withCredentials:true});}
  myCourses():Observable<Course[]>{return this.http.get<Course[]>(`${this.base}/courses/my`,{withCredentials:true});}
  enrollInCourse(trainerId:number):Observable<Course>{return this.http.post<Course>(`${this.base}/courses/${trainerId}/enroll`,{}, {withCredentials:true});}
  adminTrainers():Observable<Trainer[]>{return this.http.get<Trainer[]>(`${this.base}/trainers`,{withCredentials:true});}
  updateStudent(id:number,body:StudentRequest):Observable<Student>{return this.http.put<Student>(`${this.base}/students/${id}`,body,{withCredentials:true});}
  updateTrainer(id:number,body:TrainerRequest):Observable<Trainer>{return this.http.put<Trainer>(`${this.base}/trainers/${id}`,body,{withCredentials:true});}
  deleteStudent(id:number):Observable<{message:string}>{return this.http.delete<{message:string}>(`${this.base}/students/${id}`,{withCredentials:true});}
  deleteTrainer(id:number):Observable<{message:string}>{return this.http.delete<{message:string}>(`${this.base}/trainers/${id}`,{withCredentials:true});}
}
