export interface Student { id:number; name:string; city:string; email:string; courseName:string; trainerId:number|null; trainerName:string|null; role:string; }
export interface Trainer { id:number; name:string; className:string; courseName:string; experience:number; email:string; employeeNumber:string; role:string; }
export interface StudentRequest { name:string; city:string; email:string; password:string; courseName:string; trainerId:number; }
export interface TrainerRequest { name:string; className:string; courseName:string; experience:number; email:string; employeeNumber:string; password:string; }
export interface LoginRequest { email:string; password:string; }
export interface SessionInfo { role:string; email:string; }

export interface Course { trainerId:number; courseName:string; trainerName:string; className:string; experience:number; enrolled:boolean; enrolledAt:string|null; }
