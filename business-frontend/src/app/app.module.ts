import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VehicleOverviewDialog } from './components/ListComponents/VehicleList/vehicle-list/vehicle-list.component'
import { ConfdialogComponent } from './components/ConfirmationDialog/confdialog/confdialog.component'

import { MatToolbarModule } from '@angular/material/toolbar';
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
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SchedulerComponent } from './components/Scheduler/scheduler/scheduler.component';
import { WarehouseListComponent } from './components/ListComponents/WarehouseList/warehouse-list/warehouse-list.component';
import { WarehouseFormComponent } from './components/FormComponents/Warehousing/Warehouse/warehouse-form/warehouse-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    VehicleListComponent,
    VehicleOverviewDialog,
    ConfdialogComponent,
    SchedulerComponent,
    WarehouseListComponent,
    WarehouseFormComponent
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
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
