import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
@Injectable({providedIn:'root'})
export class AuthService {
  readonly role=signal<string|null>(null);
  constructor(private api:ApiService,private router:Router){}
  setRole(role:string){this.role.set(role);}
  logout(){this.api.logout().subscribe({next:()=>{this.role.set(null);this.router.navigate(['/']);},error:()=>{this.role.set(null);this.router.navigate(['/']);}});}
}
