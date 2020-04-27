import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  OnInit,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';


import { CalendarEvent, CalendarView } from 'angular-calendar';
import {  Observable, Subject } from 'rxjs';
import {  map } from 'rxjs/operators';
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
import { registerLocaleData, formatDate } from '@angular/common';
import { Route } from 'src/app/models/Warehousing/Route/route';
import { Invoice } from 'src/app/models/BusinessModels/Invoice/invoice';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { WarehouseService } from 'src/app/services/Warehousing/Warehouse/warehouse.service';
import { Warehouse } from 'src/app/models/Warehousing/Warehouse/warehouse';
import { Vehicle } from 'src/app/models/Warehousing/Vehicle/vehicle';
import { RouteService } from 'src/app/services/Warehousing/Route/route.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from 'src/app/services/Warehousing/Vehicle/vehicle.service';
import { ConfdialogComponent, ConfirmationDialogText } from '../../ConfirmationDialog/confdialog/confdialog.component';
import { OrderService } from 'src/app/services/BusinessServices/Order/order.service';
import { InvoiceService } from 'src/app/services/BusinessServices/Invoice/invoice.service';
import { BusinessOrder } from 'src/app/models/BusinessModels/BusinessOrder/business-order';
import { Router } from '@angular/router';

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

  public inDay;

  tmp: Observable<Invoice[]> = null;

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events$: Observable<Array<CalendarEvent<{ route: Route }>>>;

  activeDayIsOpen: boolean = false;

  refresh: Subject<any> = new Subject();

  public today: Date = new Date();

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
              title: route.routeType + ' út, Fogadó: ' + route.warehouse.city + " " + route.warehouse.street + ' raktár, Státusz: ' + route.status,
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
              title: route.routeType + ' út. ' + 'Innen: ' 
                      + route.warehouse.city + " " + route.warehouse.street + ', Cél: ' + route.destination + " Státusz: " + route.status ,
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

      width: '600px',
      data: {date: day, route: null}

    }).afterClosed().subscribe(result => {

      if(result != null){
        this.getEvents();
      }

    })
  }

  sameMonth(day): boolean{
    return isSameMonth(day.date,this.viewDate);
  }
  isToday(day): boolean{
    return (formatDate(day.date,'dd/MM/yyyy','hu') == formatDate(this.today,'dd/MM/yyyy','hu'));
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
      width: '600px',
      data: {date: null, route: event.meta.route}

    }).afterClosed().subscribe(res => {

      if(res != undefined){
        this.activeDayIsOpen = false;
        this.getEvents();
      }

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

  public selectableInvoices: Invoice[] = [];
  public selectableOrders: BusinessOrder[] = [];

  public selectableVehicle: Vehicle[] = [];

  constructor(
    public dialogRef: MatDialogRef<EventDialog>,
    private formBuilder: FormBuilder,
    public confDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: EventData,

    private warehouseService: WarehouseService,
    private vehicleService: VehicleService,
    private routeService: RouteService,
    private orderService: OrderService,
    private invoiceService: InvoiceService,

    private _snackBar: MatSnackBar,
    private routing: Router
  ){}

  async ngOnInit(): Promise<void> {

    if(this.data.date == null){
      this.detailedRoute = this.data.route;
    }else{
      this.detailedRoute.deliveryDate = this.data.date.date;
    }

    this.selectableWarehouse = await this.warehouseService.getWarehouses();

    if(this.data.route != null){

      if(this.data.route.status == "TELJESÍTVE"){
        this.disableRouteForm();
      }

      this.selectableVehicle = await this.data.route.warehouse.vehicleList;

      if( this.detailedRoute.routeType == 'Kimenő'){

        this.selectableInvoices = await this.invoiceService.getClosedInvoices();

        if(this.selectableInvoices == null){
          this.selectableVehicle = [];
        }

        if(this.detailedRoute.invoice != null){
          this.selectableInvoices.push(this.detailedRoute.invoice);
        }

      }else if( this.detailedRoute.routeType == 'Bejövő'){

        this.selectableOrders = await this.orderService.getClosedOrders();

        if(this.selectableOrders == null){
          this.selectableOrders = [];
        }

        if(this.detailedRoute.businessOrder != null){
          this.selectableOrders.push(this.detailedRoute.businessOrder);
        }

      }
      
    }

    this.routeForm.get('warehouse').valueChanges.subscribe(async result => {
      if(result != null){
        this.selectableVehicle = await this.warehouseService.getWarehousesVehicles(result.id);
      }      
    })

    this.routeForm.get('routeType').valueChanges.subscribe(async result => {
      if(result == null){
        this.selectableInvoices = [];
        this.selectableOrders = [];

      }else if(result == 'Bejövő'){

        this.selectableOrders = await this.orderService.getClosedOrders();

        if(this.selectableOrders == null){
          this.selectableOrders = [];
        }

        if(this.detailedRoute.businessOrder != null){
          this.selectableOrders.push(this.detailedRoute.businessOrder);
        }

      }else if(result == 'Kimenő'){

        this.selectableInvoices = await this.invoiceService.getClosedInvoices();

        if(this.selectableInvoices == null){
          this.selectableInvoices = [];
        }

        if(this.detailedRoute.invoice != null){
          this.selectableInvoices.push(this.detailedRoute.invoice);
        }

      }
    })

  }

  routeForm = this.formBuilder.group({
    'routeType': new FormControl(this.detailedRoute.routeType, Validators.required),
    'deliveryDate': new FormControl(this.detailedRoute.deliveryDate, Validators.required),
    'warehouse': new FormControl(this.detailedRoute.warehouse, Validators.required),
    'vehicle': new FormControl(this.detailedRoute.vehicle, Validators.required),
    'destination': new FormControl(this.detailedRoute.destination),
    'invoice': new FormControl(this.detailedRoute.invoice),
    'order': new FormControl(this.detailedRoute.businessOrder),
  });

  disableRouteForm(): void{
    this.routeForm.get('routeType').disable();
    this.routeForm.get('deliveryDate').disable();
    this.routeForm.get('warehouse').disable();
    this.routeForm.get('vehicle').disable();
    this.routeForm.get('destination').disable();
    this.routeForm.get('invoice').disable();
    this.routeForm.get('order').disable();
  }

  async saveRoute(): Promise<void>{

    if(this.detailedRoute.id == null){

      await this.routeService.createRoute(this.detailedRoute).then(result => {

        this._snackBar.open('Sikeresen létrehozott út!','',{
          duration: 2000,
          panelClass: ['success'],
        })

      }).catch(e => {
        this._snackBar.open('Sikertelen művelet :( status: ' + e.status,'',{
          duration: 4000,
          panelClass: ['error'],
        })

      });

    }else{

      await this.routeService.updateRoute(this.detailedRoute).then(result => {

        this._snackBar.open('Sikeresen módosította!','',{
          duration: 2000,
          panelClass: ['success'],
        })

      }).catch(e => {

        this._snackBar.open('Sikertelen művelet :( status: ' + e.status,'',{
          duration: 4000,
          panelClass: ['error'],
        })

        console.log(e);

      });
    }

    this.dialogRef.close({refresh: true});
  }

  deleteRoute(): void{

    let dialogData: ConfirmationDialogText = {top: 'Biztosan törli az utat?', 
                                              bottom: ''};

    const dialogRef = this.confDialog.open(ConfdialogComponent, {

      width: '300px',
      data: dialogData,

    })

    dialogRef.afterClosed().subscribe(async res => {
      if(res){
        await this.routeService.deleteRoute(this.detailedRoute.id).then(res => {

          this._snackBar.open('Sikeres törölte az utat!','', {
            duration: 2000,
            panelClass: ['success'],
          })

          this.dialogRef.close({refresh: true});
    
        }).catch(e => {
    
          this._snackBar.open('Valami nem sikerült :( status: ' + e.status,'',{
            duration: 4000,
            panelClass: ['error'],
          })
    
        })
        
      }
    })
    
  }

  async routeIsCompleted(): Promise<void>{
    

    let dialogData: ConfirmationDialogText = {top: 'Biztosan teljesítetté állítja?', bottom: 'Ezután módosítani nem, csak törölni tudja ezt az utat!'};
    const dialogRef = this.confDialog.open(ConfdialogComponent, {

      width: '300px',
      data: dialogData,

    }).afterClosed().subscribe(result => {

      if(result){
        this.detailedRoute.status = "TELJESÍTVE";

        this.routeService.updateRoute(this.detailedRoute).then(res => {

          this._snackBar.open('Az út mostantól teljesített az adatbázisban!','', {
            duration: 2000,
            panelClass: ['success'],
          })

          this.dialogRef.close({refresh: true});

        }).catch(e => {

          this._snackBar.open('Hiba történt! Status: ' + e.status,'', {
            duration: 2000,
            panelClass: ['error'],
          })

          console.log(e);

        })
      }

    })
  }

  public warehouseComparisonFunction( warehouse, value ) : boolean {
    return warehouse.id === value.id;
  }
  public vehicleComparisonFunction( vehicle, value ) : boolean {
    return vehicle.id === value.id;
  }
  public orderComparisonFunction( order, value ) : boolean {
    return order.id === value.id;
  }
  public invoiceComparisonFunction( invoice, value ) : boolean {
    return invoice.id === value.id;
  }

  openDocument(document): void{
    if(this.detailedRoute.routeType == 'Bejövő'){
      this.routing.navigate(['/orderForm'],{queryParams: {new: 'no', id:document.id}});
    }else{
      this.routing.navigate(['/invoiceForm'],{queryParams: {new: 'no', id:document.id}});
    }

    this.dialogRef.close();
  }
  
}
