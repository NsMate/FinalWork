import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VehicleOverviewDialog } from './components/ListComponents/VehicleList/vehicle-list/vehicle-list.component';
import { SchedulerComponent } from './components/Scheduler/scheduler/scheduler.component';
import { EventDialog } from './components/Scheduler/scheduler/scheduler.component';
import { WarehouseListComponent } from './components/ListComponents/WarehouseList/warehouse-list/warehouse-list.component';
import { WarehouseFormComponent } from './components/FormComponents/Warehousing/Warehouse/warehouse-form/warehouse-form.component';
import { ConfdialogComponent } from './components/ConfirmationDialog/confdialog/confdialog.component';
import { WarehouseFormStockDialog } from './components/FormComponents/Warehousing/Warehouse/warehouse-form/warehouse-form.component';
import { EmployeeSelectorDialog } from './components/FormComponents/Warehousing/Warehouse/warehouse-form/warehouse-form.component';
import { VehicleSelectorDialog } from './components/FormComponents/Warehousing/Warehouse/warehouse-form/warehouse-form.component';
import { AppUserDialog } from './components/ListComponents/EmployeeList/employee-list/employee-list.component';
import { EmployeeListComponent } from './components/ListComponents/EmployeeList/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/FormComponents/Business/employee-form/employee-form.component';
import { ProductTreeComponent } from './components/ProductTreeComponent/product-tree/product-tree.component';
import { ProductGroupDialog } from './components/ProductTreeComponent/product-tree/product-tree.component';
import { ProductDialog } from './components/ProductTreeComponent/product-tree/product-tree.component';
import { InvoiceListComponent } from './components/ListComponents/Invoice/invoice-list/invoice-list.component';
import { PartnerListComponent } from './components/ListComponents/Partner/partner-list/partner-list.component';
import { OfferListComponent } from './components/ListComponents/OfferList/offer-list/offer-list.component';
import { PartnerFormComponent } from './components/FormComponents/Partner/partner-form/partner-form.component';
import { InvoiceFormComponent } from './components/FormComponents/Invoice/invoice-form/invoice-form.component';
import { InvoiceItemDialog } from './components/FormComponents/Invoice/invoice-form/invoice-form.component';
import { OrderFormComponent } from './components/FormComponents/Order/order-form/order-form.component';
import { OrderItemDialog } from './components/FormComponents/Order/order-form/order-form.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE  } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { VehicleListComponent } from './components/ListComponents/VehicleList/vehicle-list/vehicle-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';



@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    VehicleListComponent,
    VehicleOverviewDialog,
    ConfdialogComponent,
    SchedulerComponent,
    WarehouseListComponent,
    WarehouseFormComponent,
    WarehouseFormStockDialog,
    EmployeeListComponent,
    EmployeeFormComponent,
    AppUserDialog,
    ProductTreeComponent,
    ProductGroupDialog,
    ProductDialog,
    InvoiceListComponent,
    PartnerListComponent,
    OfferListComponent,
    PartnerFormComponent,
    InvoiceFormComponent,
    InvoiceItemDialog,
    EmployeeSelectorDialog,
    VehicleSelectorDialog,
    EventDialog,
    OrderFormComponent,
    OrderItemDialog
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule,
    MatTreeModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSnackBarModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [{
    provide: MAT_DATE_LOCALE, useValue: 'hu'
  },
  {provide : LocationStrategy , useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
