import { Component } from '@angular/core'; import { RouterLink } from '@angular/router';
@Component({standalone:true,imports:[RouterLink],template:`
<section class="hero"><span class="eyebrow">LEARN · TEACH · MANAGE</span><h1>Welcome to your institute</h1><p>A simple place to manage students, trainers, and courses.</p></section>
<section class="cards"><article class="role-card"><div class="emoji">🎓</div><h2>Student Login</h2><p>View your profile and course information.</p><a class="button" routerLink="/login/student">Login as Student</a><p class="small">New student? <a routerLink="/register/student">Create an account</a></p></article>
<article class="role-card"><div class="emoji">🧑‍🏫</div><h2>Trainer Login</h2><p>View your profile and students in your course.</p><a class="button" routerLink="/login/trainer">Login as Trainer</a><p class="small">New trainer? <a routerLink="/register/trainer">Register here</a></p></article></section>
<div class="notice">Admin access is available from the top-right corner.</div>
`}) export class HomeComponent {}
