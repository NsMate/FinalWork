import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginFormComponent } from './login-form/login-form.component'
import { VehicleListComponent } from './components/ListComponents/VehicleList/vehicle-list/vehicle-list.component';
import { AuthGuard } from './AuthorizationGuard/auth-guard';
import { SchedulerComponent } from './components/Scheduler/scheduler/scheduler.component';
import { WarehouseListComponent } from './components/ListComponents/WarehouseList/warehouse-list/warehouse-list.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginFormComponent
  },
  {
    path: 'main',
    component: VehicleListComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'schedule',
    component: SchedulerComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'warehouses',
    component: WarehouseListComponent,
    canActivate: [ AuthGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
