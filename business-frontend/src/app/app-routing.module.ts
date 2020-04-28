import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginFormComponent } from './login-form/login-form.component'
import { VehicleListComponent } from './components/ListComponents/VehicleList/vehicle-list/vehicle-list.component';
import { AuthGuard } from './AuthorizationGuard/auth-guard';
import { LogisticGuard } from './AuthorizationGuard/logistic-guard';
import { SchedulerComponent } from './components/Scheduler/scheduler/scheduler.component';
import { WarehouseListComponent } from './components/ListComponents/WarehouseList/warehouse-list/warehouse-list.component';
import { WarehouseFormComponent } from './components/FormComponents/Warehousing/Warehouse/warehouse-form/warehouse-form.component';
import { EmployeeListComponent } from './components/ListComponents/EmployeeList/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/FormComponents/Business/employee-form/employee-form.component';
import { ProductTreeComponent } from './components/ProductTreeComponent/product-tree/product-tree.component';
import { InvoiceListComponent } from './components/ListComponents/Invoice/invoice-list/invoice-list.component';
import { PartnerListComponent } from './components/ListComponents/Partner/partner-list/partner-list.component';
import { OfferListComponent } from './components/ListComponents/OfferList/offer-list/offer-list.component';
import { PartnerFormComponent } from './components/FormComponents/Partner/partner-form/partner-form.component';
import { InvoiceFormComponent } from './components/FormComponents/Invoice/invoice-form/invoice-form.component';
import { OrderFormComponent } from './components/FormComponents/Order/order-form/order-form.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginFormComponent
  },
  {
    path: 'vehicleList',
    component: VehicleListComponent,
    canActivate: [ LogisticGuard ]
  },
  {
    path: 'schedule',
    component: SchedulerComponent,
    canActivate: [ LogisticGuard ]
  },
  {
    path: 'warehouses',
    component: WarehouseListComponent,
    canActivate: [ LogisticGuard ]
  },
  {
    path: 'warehouseForm',
    component: WarehouseFormComponent,
    canActivate: [ LogisticGuard ],
  },
  {
    path: 'employeeList',
    component: EmployeeListComponent,
    canActivate: [ LogisticGuard ]
  },
  {
    path: 'employeeForm',
    component: EmployeeFormComponent,
    canActivate: [ LogisticGuard ]
  },
  {
    path: 'productTree',
    component: ProductTreeComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'invoiceList',
    component: InvoiceListComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'partnerList',
    component: PartnerListComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'orderList',
    component: OfferListComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'partnerForm',
    component: PartnerFormComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'invoiceForm',
    component: InvoiceFormComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'orderForm',
    component: OrderFormComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
