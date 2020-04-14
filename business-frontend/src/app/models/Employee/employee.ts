import { AppUser } from '../AppUser/app-user';

export class Employee {
    id: number;
    firstName: string = "";
    lastName: string = "";
    phoneNumber: string = "";
    email: string = "";
    department: string = "";
    appUser: AppUser;
}
