import { Employee } from '../Employee/employee';

export class AppUser {
    id:number;
    appUserName: string = "";
    appUserPassword: string = "";
    appUserGroup: string = "";
    employee: Employee;
}
