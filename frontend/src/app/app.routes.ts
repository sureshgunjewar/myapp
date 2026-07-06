import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Admin } from './admin/admin';
import { Login } from './login/login';
import { EmployeeList } from './employees/employee-list/employee-list';
import { EmployeeForm } from './employees/employee-form/employee-form';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Home,
        canActivate: [AuthGuard]
    },
    {
        path: 'employees',
        component: EmployeeList,
        canActivate: [AuthGuard]
    },
    {
        path: 'employees/new',
        component: EmployeeForm,
        canActivate: [AuthGuard]
    },
    {
        path: 'employees/:id/edit',
        component: EmployeeForm,
        canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        component: Admin,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];
