import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
export const errorInterceptor:HttpInterceptorFn=(req,next)=>next(req).pipe(catchError((error:HttpErrorResponse)=>{
 const message=error.error?.message || (error.status===0?'Cannot connect to the backend. Is Spring Boot running?':'Request failed. Please try again.');
 return throwError(()=>new Error(message));
}));
