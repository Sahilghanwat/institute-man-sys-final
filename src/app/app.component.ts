import { Component } from '@angular/core'; import { RouterLink, RouterOutlet } from '@angular/router';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink],template:`
<header class="topbar"><a class="brand" routerLink="/">Institute Management System</a><a class="admin-link" routerLink="/login/admin">Admin Login</a></header>
<main class="page"><router-outlet /></main><footer>Institute Management System · Learning project</footer>
`}) export class AppComponent {}
