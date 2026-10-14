import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { Course, Student, Trainer } from '../core/models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="dashboard-head">
      <div><span class="eyebrow">STUDENT PORTAL</span><h1>My Profile</h1><p class="muted">Your admission details, enrolled courses, and learning options.</p></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="button secondary" type="button" (click)="refreshAll()" [disabled]="loading">{{ loading ? 'Refreshing…' : 'Refresh Profile' }}</button><button class="button secondary" type="button" (click)="auth.logout()">Logout</button></div>
    </section>
    <p class="muted" *ngIf="loading && !student">Loading your profile…</p><p class="success" *ngIf="message">{{ message }}</p><p class="error" *ngIf="error">{{ error }} <a routerLink="/login/student">Login again</a></p>
    <ng-container *ngIf="student as s">
      <section class="cards" style="max-width:900px;margin:0 auto 20px">
        <article class="role-card" style="text-align:left"><div class="emoji">📚</div><h2>Admission Course</h2><p>{{ s.courseName || 'No course information available' }}</p><p class="small">Your original admission details remain unchanged.</p></article>
        <article class="role-card" style="text-align:left"><div class="emoji">👨‍🏫</div><h2>Assigned Trainer</h2><p>{{ s.trainerName || 'No trainer assigned yet' }}</p><p class="small" *ngIf="s.trainerId != null">Trainer ID: {{ s.trainerId }}</p></article>
      </section>
      <section class="profile-card"><div class="avatar">{{ (s.name || '?').charAt(0).toUpperCase() }}</div><h2>{{ s.name }}</h2><p class="muted">Student ID: {{ s.id }}</p><div class="details"><div><span>Email</span><strong>{{ s.email }}</strong></div><div><span>City</span><strong>{{ s.city }}</strong></div><div><span>Admission Course</span><strong>{{ s.courseName || 'Not available' }}</strong></div><div><span>Assigned Trainer</span><strong>{{ s.trainerName || 'Not assigned' }}</strong></div></div></section>
    </ng-container>
    <section style="margin-top:30px"><div class="dashboard-head"><div><span class="eyebrow">LEARNING</span><h2>Explore All Courses</h2><p class="muted">Choose from courses offered by all registered trainers.</p></div><button class="button secondary" (click)="loadCourses()" [disabled]="coursesLoading">{{ coursesLoading ? 'Loading…' : 'Refresh Courses' }}</button></div>
      <p class="error" *ngIf="coursesError">{{ coursesError }}</p><p class="muted" *ngIf="coursesLoading">Loading courses…</p>
      <section class="cards" *ngIf="!coursesLoading" style="margin-bottom:24px">
        <article class="role-card" *ngFor="let course of courses" style="text-align:left"><div class="emoji">🎓</div><h3>{{ course.courseName }}</h3><p><strong>Trainer:</strong> {{ course.trainerName }}</p><p><strong>Class:</strong> {{ course.className }}</p><p><strong>Experience:</strong> {{ course.experience }} years</p><button class="button" type="button" (click)="openCourse(course)">{{ course.enrolled ? 'View Enrollment' : 'View Course' }}</button></article>
      </section><p class="muted" *ngIf="!coursesLoading && courses.length===0 && !coursesError">No trainer courses are available yet.</p>
    </section>
    <section style="margin-top:30px"><h2>My Courses</h2><p class="muted">Courses you have enrolled in are saved to your account.</p><p class="muted" *ngIf="myCoursesLoading">Loading your courses…</p><section class="cards" *ngIf="!myCoursesLoading"><article class="role-card" *ngFor="let course of enrolledCourses" style="text-align:left"><h3>{{ course.courseName }}</h3><p><strong>Trainer:</strong> {{ course.trainerName }}</p><p><strong>Class:</strong> {{ course.className }}</p><p class="small" *ngIf="course.enrolledAt">Enrolled: {{ course.enrolledAt | date:'mediumDate' }}</p><span class="success">Enrolled</span></article></section><p class="muted" *ngIf="!myCoursesLoading && enrolledCourses.length===0">You have not enrolled in any additional courses yet.</p></section>
    <div *ngIf="selectedCourse as course" (click)="closeCourse()" style="position:fixed;inset:0;background:#0008;display:flex;align-items:center;justify-content:center;padding:20px;z-index:1000"><section class="profile-card" role="dialog" aria-modal="true" aria-label="Course details" (click)="$event.stopPropagation()" style="width:100%;max-width:480px;text-align:left"><button class="button secondary" style="float:right" (click)="closeCourse()">Close</button><span class="eyebrow">COURSE DETAILS</span><h2>{{ course.courseName }}</h2><p><strong>Trainer:</strong> {{ course.trainerName }}</p><p><strong>Class:</strong> {{ course.className }}</p><p><strong>Trainer experience:</strong> {{ course.experience }} years</p><p class="muted">Enrollment will be saved to your student account. Your admission course and assigned trainer will not change.</p><p class="error" *ngIf="enrollError">{{ enrollError }}</p><p class="success" *ngIf="enrollMessage">{{ enrollMessage }}</p><button class="button" *ngIf="!course.enrolled" (click)="enroll(course)" [disabled]="enrolling">{{ enrolling ? 'Enrolling…' : 'Enroll in this Course' }}</button><span class="success" *ngIf="course.enrolled">You are already enrolled in this course.</span></section></div>
  `
})
export class StudentDashboardComponent implements OnInit {
  private api=inject(ApiService); private cdr=inject(ChangeDetectorRef); auth=inject(AuthService);
  student?:Student; courses:Course[]=[]; enrolledCourses:Course[]=[]; selectedCourse?:Course;
  error=''; message=''; coursesError=''; enrollError=''; enrollMessage=''; loading=false; coursesLoading=false; myCoursesLoading=false; enrolling=false;
  ngOnInit():void { this.refreshAll(); }
  refreshAll():void { this.refreshProfile(); this.loadCourses(); this.loadMyCourses(); }
  refreshProfile():void { this.loading=true; this.error=''; this.api.studentMe().subscribe({next:d=>{this.student=d;this.loading=false;this.cdr.markForCheck();},error:(e:Error)=>{this.error=e.message;this.loading=false;this.cdr.markForCheck();}}); }
  loadCourses():void { this.coursesLoading=true;this.coursesError='';this.api.courses().subscribe({next:d=>{this.courses=d;this.coursesLoading=false;this.cdr.markForCheck();},error:(e:Error)=>{this.coursesError=e.message;this.coursesLoading=false;this.cdr.markForCheck();}}); }
  loadMyCourses():void { this.myCoursesLoading=true;this.api.myCourses().subscribe({next:d=>{this.enrolledCourses=d;this.myCoursesLoading=false;this.cdr.markForCheck();},error:(e:Error)=>{this.myCoursesLoading=false;this.cdr.markForCheck();}}); }
  openCourse(course:Course):void { this.selectedCourse=course;this.enrollError='';this.enrollMessage=''; }
  closeCourse():void { if(!this.enrolling)this.selectedCourse=undefined; }
  enroll(course:Course):void { if(this.enrolling)return;this.enrolling=true;this.enrollError='';this.enrollMessage='';this.api.enrollInCourse(course.trainerId).subscribe({next:updated=>{this.courses=this.courses.map(c=>c.trainerId===updated.trainerId?updated:c);this.selectedCourse=updated;this.enrollMessage='Enrollment saved successfully.';this.enrolling=false;this.loadMyCourses();this.cdr.markForCheck();},error:(e:Error)=>{this.enrollError=e.message;this.enrolling=false;this.cdr.markForCheck();}}); }
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="dashboard-head">
      <div>
        <span class="eyebrow">TRAINER PORTAL</span>
        <h1>My Trainer Profile</h1>
        <p class="muted">Manage your course and view your students.</p>
      </div>
      <button class="button secondary" type="button" (click)="auth.logout()">Logout</button>
    </section>

    <p class="error" *ngIf="error">
      {{ error }} <a routerLink="/login/trainer">Login again</a>
    </p>

    <section class="profile-card" *ngIf="trainer as t">
      <div class="avatar">{{ (t.name || '?').charAt(0).toUpperCase() }}</div>
      <h2>{{ t.name }}</h2>
      <p class="muted">Employee No: {{ t.employeeNumber }}</p>
      <div class="details">
        <div><span>Email</span><strong>{{ t.email }}</strong></div>
        <div><span>Class / Batch</span><strong>{{ t.className }}</strong></div>
        <div><span>Course</span><strong>{{ t.courseName }}</strong></div>
        <div><span>Experience</span><strong>{{ t.experience }} years</strong></div>
      </div>
      <a class="button" routerLink="/trainer/students">View My Students</a>
    </section>
  `
})
export class TrainerDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);
  trainer?: Trainer;
  error = '';

  ngOnInit(): void {
    this.api.trainerMe().subscribe({
      next: data => {
        this.trainer = data;
        this.cdr.markForCheck();
      },
      error: (e: Error) => {
        this.error = e.message;
        this.cdr.markForCheck();
      }
    });
  }
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="dashboard-head">
      <div>
        <a routerLink="/trainer" class="back">← Trainer dashboard</a>
        <h1>Students in My Course</h1>
      </div>
      <button class="button secondary" type="button" (click)="auth.logout()">Logout</button>
    </section>

    <p class="error" *ngIf="error">{{ error }}</p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>City</th><th>Course</th></tr>
        </thead>
        <tbody>
          @for (s of students; track s.id) {
            <tr>
              <td>{{ s.id }}</td><td>{{ s.name }}</td><td>{{ s.email }}</td>
              <td>{{ s.city }}</td><td>{{ s.courseName }}</td>
            </tr>
          }
        </tbody>
      </table>
      <p class="empty" *ngIf="students.length === 0 && !error">No students assigned yet.</p>
    </div>
  `
})
export class TrainerStudentsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);
  students: Student[] = [];
  error = '';

  ngOnInit(): void {
    this.api.myStudents().subscribe({
      next: data => {
        this.students = Array.isArray(data) ? data : [];
        this.cdr.markForCheck();
      },
      error: (e: Error) => {
        this.error = e.message;
        this.cdr.markForCheck();
      }
    });
  }
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="dashboard-head">
      <div>
        <span class="eyebrow">ADMINISTRATION</span>
        <h1>Admin Dashboard</h1>
        <p class="muted">View, edit, and remove student or trainer records.</p>
      </div>
      <button class="button secondary" type="button" (click)="auth.logout()">Logout</button>
    </section>

    <p class="error" *ngIf="error">{{ error }}</p>
    <p class="success" *ngIf="message">{{ message }}</p>

    <section class="admin-section">
      <h2>Student Search (Elasticsearch)</h2>
      <p class="muted">Search indexed student records by name, email, city, course, or trainer.</p>
      <div class="search-controls" style="display:flex; gap:8px; flex-wrap:wrap; margin:12px 0;">
        <input aria-label="Search students" name="studentSearchQuery" [(ngModel)]="studentSearchQuery"
          (keyup.enter)="searchStudents()" placeholder="Enter name, email, city, course, or trainer"
          style="flex:1; min-width:220px; padding:10px; border:1px solid #cbd5e1; border-radius:8px;">
        <button class="button" type="button" (click)="searchStudents()" [disabled]="searchLoading">
          {{ searchLoading ? 'Searching…' : 'Search' }}
        </button>
        <button class="button secondary" type="button" (click)="reindexSearch()" [disabled]="reindexLoading">
          {{ reindexLoading ? 'Indexing…' : 'Rebuild Search Index' }}
        </button>
        <button class="button secondary" type="button" (click)="clearStudentSearch()">Clear</button>
      </div>
      <p class="muted" *ngIf="searchMessage">{{ searchMessage }}</p>
      <p class="error" *ngIf="searchError">{{ searchError }}</p>
      <div class="table-wrap" *ngIf="searchPerformed">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>City</th><th>Course</th><th>Trainer</th></tr></thead>
          <tbody>
            @for (s of searchResults; track s.id) {
              <tr><td>{{ s.id }}</td><td>{{ s.name }}</td><td>{{ s.email }}</td><td>{{ s.city }}</td><td>{{ s.courseName }}</td><td>{{ s.trainerName || 'Not assigned' }}</td></tr>
            }
          </tbody>
        </table>
        <p class="empty" *ngIf="searchResults.length === 0 && !searchLoading">No matching indexed students found. Rebuild the index if this is the first search.</p>
      </div>
    </section>

    <section class="admin-section">
      <h2>Students <span class="count">{{ students.length }}</span></h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>City</th>
              <th>Course</th><th>Trainer</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (s of students; track s.id) {
              <tr style="display: table-row; color: #172033; background: #ffffff;">
                <td style="color: #172033; background: #ffffff;">{{ s.id }}</td>
                <td style="color: #172033; background: #ffffff;">{{ s.name }}</td>
                <td style="color: #172033; background: #ffffff;">{{ s.email }}</td>
                <td style="color: #172033; background: #ffffff;">{{ s.city }}</td>
                <td style="color: #172033; background: #ffffff;">{{ s.courseName }}</td>
                <td style="color: #172033; background: #ffffff;">{{ s.trainerName || 'Not assigned' }}</td>
                <td class="actions" style="color: #172033; background: #ffffff;">
                  <button class="mini" type="button" (click)="editStudent(s)">Edit</button>
                  <button class="mini danger" type="button" (click)="deleteStudent(s)">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        <p class="empty" *ngIf="students.length === 0">No students yet.</p>
      </div>
    </section>

    <section class="admin-section">
      <h2>Trainers <span class="count">{{ trainers.length }}</span></h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Course</th>
              <th>Class</th><th>Employee No.</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (t of trainers; track t.id) {
              <tr style="display: table-row; color: #172033; background: #ffffff;">
                <td style="color: #172033; background: #ffffff;">{{ t.id }}</td>
                <td style="color: #172033; background: #ffffff;">{{ t.name }}</td>
                <td style="color: #172033; background: #ffffff;">{{ t.email }}</td>
                <td style="color: #172033; background: #ffffff;">{{ t.courseName }}</td>
                <td style="color: #172033; background: #ffffff;">{{ t.className }}</td>
                <td style="color: #172033; background: #ffffff;">{{ t.employeeNumber }}</td>
                <td class="actions" style="color: #172033; background: #ffffff;">
                  <button class="mini" type="button" (click)="editTrainer(t)">Edit</button>
                  <button class="mini danger" type="button" (click)="deleteTrainer(t)">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        <p class="empty" *ngIf="trainers.length === 0">No trainers yet.</p>
      </div>
    </section>

    <div class="modal-backdrop" *ngIf="editingStudent || editingTrainer">
      <section class="form-card modal">
        <button class="close" type="button" (click)="cancelEdit()">×</button>
        <h2>Edit {{ editingStudent ? 'Student' : 'Trainer' }}</h2>

        <form *ngIf="editingStudent" (ngSubmit)="saveStudent()" class="form-grid">
          <label>Name<input name="sname" [(ngModel)]="studentForm.name" required></label>
          <label>City<input name="scity" [(ngModel)]="studentForm.city" required></label>
          <label>Email<input name="semail" type="email" [(ngModel)]="studentForm.email" required></label>
          <label>Course<input name="scourse" [(ngModel)]="studentForm.courseName" required></label>
          <label>Trainer ID<input name="strainer" type="number" [(ngModel)]="studentForm.trainerId" required></label>
          <label>New password (optional)<input name="spassword" type="password" [(ngModel)]="studentForm.password"></label>
          <button class="button span-all" type="submit">Save Student</button>
        </form>

        <form *ngIf="editingTrainer" (ngSubmit)="saveTrainer()" class="form-grid">
          <label>Name<input name="tname" [(ngModel)]="trainerForm.name" required></label>
          <label>Class / Batch<input name="tclass" [(ngModel)]="trainerForm.className" required></label>
          <label>Course<input name="tcourse" [(ngModel)]="trainerForm.courseName" required></label>
          <label>Experience<input name="texp" type="number" min="0" [(ngModel)]="trainerForm.experience" required></label>
          <label>Email<input name="temail" type="email" [(ngModel)]="trainerForm.email" required></label>
          <label>Employee number<input name="temp" [(ngModel)]="trainerForm.employeeNumber" required></label>
          <label class="span-all">New password (optional)<input name="tpassword" type="password" [(ngModel)]="trainerForm.password"></label>
          <button class="button span-all" type="submit">Save Trainer</button>
        </form>
      </section>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);

  students: Student[] = [];
  trainers: Trainer[] = [];
  error = '';
  message = '';
  studentSearchQuery = '';
  searchResults: Student[] = [];
  searchLoading = false;
  searchPerformed = false;
  searchMessage = '';
  searchError = '';
  reindexLoading = false;
  editingStudent?: Student;
  editingTrainer?: Trainer;
  studentForm: any = {};
  trainerForm: any = {};

  ngOnInit(): void {
    this.refresh();
  }

  searchStudents(): void {
    const query = this.studentSearchQuery.trim();
    if (!query) {
      this.searchError = 'Enter a search term first.';
      this.searchMessage = '';
      this.searchResults = [];
      this.searchPerformed = false;
      return;
    }
    this.searchLoading = true;
    this.searchError = '';
    this.searchMessage = '';
    this.searchPerformed = true;
    this.api.searchStudents(query).subscribe({
      next: data => {
        this.searchResults = Array.isArray(data) ? data : [];
        this.searchMessage = `Found ${this.searchResults.length} matching student(s).`;
        this.searchLoading = false;
        this.cdr.markForCheck();
      },
      error: (e: Error) => {
        this.searchError = e.message;
        this.searchLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  reindexSearch(): void {
    this.reindexLoading = true;
    this.searchError = '';
    this.searchMessage = '';
    this.api.reindexStudentSearch().subscribe({
      next: result => {
        this.searchMessage = `${result.message} Indexed ${result.indexedCount} student(s).`;
        this.reindexLoading = false;
        if (this.studentSearchQuery.trim()) this.searchStudents();
        this.cdr.markForCheck();
      },
      error: (e: Error) => {
        this.searchError = e.message;
        this.reindexLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  clearStudentSearch(): void {
    this.studentSearchQuery = '';
    this.searchResults = [];
    this.searchPerformed = false;
    this.searchMessage = '';
    this.searchError = '';
  }

  refresh(): void {
    this.error = '';

    this.api.students().subscribe({
      next: data => {
        this.students = Array.isArray(data) ? data : [];
        console.log('Admin students loaded:', this.students);
        this.cdr.markForCheck();
      },
      error: (e: Error) => {
        this.error = e.message;
        this.cdr.markForCheck();
      }
    });

    this.api.adminTrainers().subscribe({
      next: data => {
        this.trainers = Array.isArray(data) ? data : [];
        console.log('Admin trainers loaded:', this.trainers);
        this.cdr.markForCheck();
      },
      error: (e: Error) => {
        this.error = e.message;
        this.cdr.markForCheck();
      }
    });
  }

  editStudent(student: Student): void {
    this.editingStudent = student;
    this.editingTrainer = undefined;
    this.studentForm = {
      name: student.name,
      city: student.city,
      email: student.email,
      courseName: student.courseName,
      trainerId: student.trainerId,
      password: ''
    };
  }

  editTrainer(trainer: Trainer): void {
    this.editingTrainer = trainer;
    this.editingStudent = undefined;
    this.trainerForm = {
      name: trainer.name,
      className: trainer.className,
      courseName: trainer.courseName,
      experience: trainer.experience,
      email: trainer.email,
      employeeNumber: trainer.employeeNumber,
      password: ''
    };
  }

  cancelEdit(): void {
    this.editingStudent = undefined;
    this.editingTrainer = undefined;
  }

  saveStudent(): void {
    if (!this.editingStudent) return;
    const student = this.editingStudent;
    this.api.updateStudent(student.id, {
      ...this.studentForm,
      trainerId: Number(this.studentForm.trainerId)
    }).subscribe({
      next: () => {
        this.message = 'Student updated.';
        this.error = '';
        this.cancelEdit();
        this.refresh();
      },
      error: (e: Error) => this.error = e.message
    });
  }

  saveTrainer(): void {
    if (!this.editingTrainer) return;
    const trainer = this.editingTrainer;
    this.api.updateTrainer(trainer.id, {
      ...this.trainerForm,
      experience: Number(this.trainerForm.experience)
    }).subscribe({
      next: () => {
        this.message = 'Trainer updated.';
        this.error = '';
        this.cancelEdit();
        this.refresh();
      },
      error: (e: Error) => this.error = e.message
    });
  }

  deleteStudent(student: Student): void {
    if (!confirm(`Delete student ${student.name}?`)) return;
    this.api.deleteStudent(student.id).subscribe({
      next: () => {
        this.message = 'Student deleted.';
        this.error = '';
        this.refresh();
      },
      error: (e: Error) => this.error = e.message
    });
  }

  deleteTrainer(trainer: Trainer): void {
    if (!confirm(`Delete trainer ${trainer.name}? Trainers with assigned students cannot be deleted.`)) return;
    this.api.deleteTrainer(trainer.id).subscribe({
      next: () => {
        this.message = 'Trainer deleted.';
        this.error = '';
        this.refresh();
      },
      error: (e: Error) => this.error = e.message
    });
  }
}
