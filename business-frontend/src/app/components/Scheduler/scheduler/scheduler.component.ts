import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  ViewEncapsulation,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { RouteEvent } from '../../../models/Warehousing/RouteEvent/route-event'

import { CalendarEvent, CalendarEventTitleFormatter, CalendarView } from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent, Observable, Subject } from 'rxjs';
import { finalize, takeUntil, map, startWith } from 'rxjs/operators';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';
import localeHu from '@angular/common/locales/hu'
import { registerLocaleData } from '@angular/common';
import { CalendarEventService } from 'src/app/services/Warehousing/CalendarEvent/calendar-event.service';
import { Route } from 'src/app/models/Warehousing/Route/route';
import { InvoiceService } from 'src/app/services/BusinessServices/Invoice/invoice.service';
import { Invoice } from 'src/app/models/BusinessModels/Invoice/invoice';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { WarehouseService } from 'src/app/services/Warehousing/Warehouse/warehouse.service';
import { Warehouse } from 'src/app/models/Warehousing/Warehouse/warehouse';
import { Vehicle } from 'src/app/models/Warehousing/Vehicle/vehicle';
import { RouteService } from 'src/app/services/Warehousing/Route/route.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from 'src/app/services/Warehousing/Vehicle/vehicle.service';

interface EventData{
  date;
  route: Route;
}

@Component({
  selector: 'app-scheduler',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SchedulerComponent implements OnInit{

  locale:string = 'hu';

  inDay;

  tmp: Observable<Invoice[]> = null;

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events$: Observable<Array<CalendarEvent<{ route: Route }>>>;

  activeDayIsOpen: boolean = false;

  refresh: Subject<any> = new Subject();

  constructor(
    private routeService: RouteService,
    public eventDialog: MatDialog
  ){}

  ngOnInit(): void{
    registerLocaleData(localeHu, 'hu');
    this.getEvents();
  }

  getEvents(){
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    let startDate = format(getStart(this.viewDate), 'yyyy-MM-dd');
    let endDate = format(getEnd(this.viewDate), 'yyyy-MM-dd');

    this.events$ = this.routeService.getRoutesBetweenDates(
      startDate,
      endDate).pipe(
      map(( results: Route[] ) => {
        return results.map((route: Route) => {
          if(route.routeType == 'Bejövő'){
            return {
              title: route.routeType + ' út',
              start: new Date(route.deliveryDate),
              allDay: true,
              color: {
                primary: '#00EE18',
                secondary: '#00EE18',
              },
              meta: {
                route,
              },
            };
          }else{
            return {
              title: route.routeType + ' út',
              start: new Date(route.deliveryDate),
              allDay: true,
              color: {
                primary: '#0010EE',
                secondary: '#0010EE',
              },
              meta: {
                route,
              },
            };
          }
        });
      })
    );
  }

  dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: Array<CalendarEvent<{ invoice: Invoice }>>;
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  openDialog(day): void{
    
    const dialogRef = this.eventDialog.open(EventDialog, {

      width: '500px',
      data: {date: day, route: null}

    }).afterClosed().subscribe(result => {

      this.getEvents();

    })
  }

  sameMonth(day): boolean{
    return isSameMonth(day.date,this.viewDate);
  }

  changeToDay(){
    this.view = CalendarView.Day;
  }
  changeToWeek(){
    this.view = CalendarView.Week;
  }
  changeToMonth(){
    this.view = CalendarView.Month;
  }

  eventClicked({ event }: { event: CalendarEvent }): void {

    const dialogRef = this.eventDialog.open(EventDialog, {
      width: '500px',
      data: {date: null, route: event.meta.route}

    }).afterClosed().subscribe(res => {

      this.activeDayIsOpen = false;
      this.getEvents();

    })
  }

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
}

@Component({
  selector: 'event-dialog',
  templateUrl: './event-dialog.html',
})
export class EventDialog implements OnInit{

  public detailedRoute: Route = new Route();

  public selectableWarehouse: Warehouse[] = [];

  public selectableVehicle: Vehicle[] = [];

  constructor(
    public dialogRef: MatDialogRef<EventDialog>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: EventData,
    private warehouseService: WarehouseService,
    private vehicleService: VehicleService,
    private routeService: RouteService,
    private _snackBar: MatSnackBar
  ){}

  async ngOnInit(): Promise<void> {

    if(this.data.date == null){
      this.detailedRoute = this.data.route;
    }else{
      this.detailedRoute.deliveryDate = this.data.date.date;
    }

    this.selectableWarehouse = await this.warehouseService.getWarehouses();

    if(this.data.route != null){
      this.selectableVehicle = await this.vehicleService.getVehicles();
    }

    this.routeForm.get('warehouse').valueChanges.subscribe(async result => {
      if(result != null){
        this.selectableVehicle = await this.warehouseService.getWarehousesVehicles(result.id);
      }      
    })
  }

  routeForm = this.formBuilder.group({
    'routeType': new FormControl(this.detailedRoute.routeType, Validators.required),
    'deliveryDate': new FormControl(this.detailedRoute.deliveryDate, Validators.required),
    'warehouse': new FormControl(this.detailedRoute.warehouse),
    'vehicle': new FormControl(this.detailedRoute.vehicle, Validators.required),
    'destination': new FormControl(this.detailedRoute.destination),
  });

  async saveRoute(): Promise<void>{

    if(this.detailedRoute.id == null){

      await this.routeService.createRoute(this.detailedRoute.warehouse.id,this.detailedRoute.vehicle.id,this.detailedRoute).then(result => {

        this._snackBar.open('Sikeresen létrehozott út!','',{
          duration: 2000,
        })

      }).catch(e => {
        this._snackBar.open('Sikertelen művelet :( status: ' + e.status,'',{
          duration: 4000,
        })

      });

    }else{

      await this.routeService.updateRoute(this.detailedRoute).then(result => {

        this._snackBar.open('Sikeresen módosította!','',{
          duration: 2000,
        })

      }).catch(e => {

        this._snackBar.open('Sikertelen művelet :( status: ' + e.status,'',{
          duration: 4000,
        })

      });;
    }

    this.dialogRef.close();
  }

  async deleteRoute(): Promise<void>{

    await this.routeService.deleteRoute(this.detailedRoute.id).then(res => {

      this._snackBar.open('Sikeres törölte az utat!','', {
        duration: 2000,
      })

    }).catch(e => {
      this._snackBar.open('Valami nem sikerült :( status: ' + e.status,'',{
        duration: 4000,
      })

    })
    
    this.dialogRef.close();
  }

  public warehouseComparisonFunction( warehouse, value ) : boolean {
    return warehouse.id === value.id;
  }
  public vehicleComparisonFunction( vehicle, value ) : boolean {
    return vehicle.id === value.id;
  }
  
}
