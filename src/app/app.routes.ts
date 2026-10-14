import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { LoginComponent } from './pages/login.component';
import { RegisterStudentComponent, RegisterTrainerComponent } from './pages/register.component';
import { StudentDashboardComponent, TrainerDashboardComponent, TrainerStudentsComponent, AdminDashboardComponent } from './pages/dashboards.component';
export const routes:Routes=[
 {path:'',component:HomeComponent},{path:'login/:role',component:LoginComponent},{path:'register/student',component:RegisterStudentComponent},{path:'register/trainer',component:RegisterTrainerComponent},
 {path:'student',component:StudentDashboardComponent},{path:'trainer',component:TrainerDashboardComponent},{path:'trainer/students',component:TrainerStudentsComponent},{path:'admin',component:AdminDashboardComponent},
 {path:'**',redirectTo:''}
];
