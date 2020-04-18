import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { InvoiceItem } from 'src/app/models/BusinessModels/InvoiceItem/invoice-item';
import { BusinessOrder } from 'src/app/models/BusinessModels/BusinessOrder/business-order';
import { Partner } from 'src/app/models/BusinessModels/Partner/partner';
import { Observable, from } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PartnerService } from 'src/app/services/BusinessServices/Partner/partner.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthorizationService } from 'src/app/services/authorization-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from 'src/app/services/BusinessServices/Order/order.service';
import { MatSort } from '@angular/material/sort';
import { ConfdialogComponent, ConfirmationDialogText } from 'src/app/components/ConfirmationDialog/confdialog/confdialog.component';
import { OrderItem } from 'src/app/models/BusinessModels/OrderItem/order-item';
import { PdfGenerator } from 'src/app/PDFGenerator/pdf-generator';
import { OrderItemService } from 'src/app/services/BusinessServices/OrderItem/order-item.service';

export interface ItemDialog{
  isNew: boolean,
  orderId: number,
  orderItem: OrderItem,
}

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  /**
   * detailedInvoice hold the invoice discussed on the form
   * invoiceItems hold the items of detailedInvoice
   */

  public detailedOrder: BusinessOrder = new BusinessOrder();
  private orderItems: InvoiceItem[] = [];

  /**
   * ownComapny hold the information of our own company, used for pdf generation
   */
  public ownCompany: Partner = new Partner();

  /**
   * dataSource holds the information for the table of invoiceItems 
   */
  public dataSource;
  
  /**
   * minDate gives us the minimum date of the dueDate
   */
  public minDate = new Date();

  /**
   * totalPrice holds the invoices total price with vat
   * plusVat holds the invoices plus money for the government
   * netWorth hold the invoices net total price
   */
  public totalPrice: number = 0;
  public plusVat: number = 0;
  public netWorth: number = 0;

  /**
   * filteredPartners hold the partners which matches the value
   *    given to the partner field on the form
   *    autocomplete
   */
  public filteredPartners: Observable<Partner[]> = null;

  public date: boolean = false;

  /**
   * 
   * @param orderService used for order db operations
   * @param formBuilder used to build up the order form
   * @param partnerService used to get the partners from the database
   * @param itemDialog dialog for adding items to the order
   * @param confDialog dialog for the confirmation of deleting the order
   * @param route used for getting the query string paramters
   * @param routing used for navigating to another page
   * @param _snackBar used to give feedback to the user about his/her actions
   * @param authService used for checking the role of the user
   */
  constructor(
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private partnerService: PartnerService,
    private itemDialog: MatDialog,
    public confDialog: MatDialog,
    private route: ActivatedRoute,
    private routing: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthorizationService
  ) {}
  
  /**
   * detailed order is loaded in by query parameters
   * order items loaded in by query parameters
   * sort added to table, calculating prices
   * and watching the partner field for changes =>
   *    if change get partners from db by the value of field
   */
  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async params => {
      if(params.new == 'no'){
        this.detailedOrder = await this.orderService.getBusinessOrder(parseInt(params.id));
        this.orderItems = await this.orderService.getBusinessOrdersItems(parseInt(params.id));
      }
      this.dataSource = new MatTableDataSource(this.orderItems);
      this.dataSource.sort = this.sort;

      this.calculateOrderPrices();

      this.date = new Date(this.detailedOrder.dueDate).getTime() < new Date(this.detailedOrder.issueDate).getTime();

      this.minDate = new Date(this.detailedOrder.issueDate);

      if(this.detailedOrder.status == 'CLOSED' || this.detailedOrder.status == 'DONE'){
        this.disableForm();
      }
    });
    
    this.orderForm.get('partner').valueChanges.subscribe(
      async val => {
        if(val == ' '){
          this.filteredPartners = await from(this.partnerService.getOutsidePartners());
        }else{
          this.filteredPartners = await this.partnerService.getPartnersByInput(val);
        }
      }
    );

    this.ownCompany = await this.partnerService.getOwnCompany();
  }

  /**
   * Creating sort for the table, and defining the columns for the table
   */
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['product', 'quantity', 'description', 'price' ,'totalPrice'];

  /**
   * form control for the form on the page, here are the getters for the fields
   *    and the validators
   */
  orderForm = this.formBuilder.group({
    'partner': new FormControl(this.detailedOrder.partner, Validators.required),
    'issueDate': new FormControl(this.detailedOrder.issueDate, Validators.compose([Validators.required])),
    'dueDate': new FormControl(this.detailedOrder.dueDate, Validators.compose([Validators.required])),
    'orderDescription': new FormControl(this.detailedOrder.orderDescription),
    'vat': new FormControl(this.detailedOrder.vat, Validators.compose([Validators.required,Validators.pattern("[1-9][0-9]*"),Validators.maxLength(2)])),
    'paymentType': new FormControl(this.detailedOrder.paymentType, Validators.required),
  })

  get partner() { return this.orderForm.get('partner'); }
  get issueDate() { return this.orderForm.get('issueDate'); }
  get dueDate() { return this.orderForm.get('dueDate'); }
  get orderDescription() { return this.orderForm.get('orderDescription'); }
  get vat() { return this.orderForm.get('vat'); }
  get paymentType() { return this.orderForm.get('paymentType'); }

  /**
   * This function is used for comparing the partners when loading in an order
   *    so the autocomplete can display the correct value from the database
   */
  displayFn(val: Partner) {
    return val ? val.partnerName : val;
  }

  /**
   * This function is used to create or update the detailed order
   * based on if the order's id is null.
   * 
   * After the creation or update the user is informed on the success or
   * failure of the action by a snackbar.
   */
  saveOrder(){
    if(this.detailedOrder.id == null){
      this.orderService.createBusinessOrder(this.detailedOrder).then(result => {

        this.detailedOrder = result;
        this.routing.navigate(['.'], { relativeTo: this.route, queryParams: { new: 'no', id: result.id }});

        this._snackBar.open('Sikeresen létrehozta a rendelést!','', {
          duration: 2000,
          panelClass: ['success'],
        })

      }).catch(e => {

        this._snackBar.open('Hiba történt! ' + e.status,'', {
          duration: 5000,
          panelClass: ['error'],
        })

      });

    }else{

      this.orderService.updateBusinessOrder(this.detailedOrder).then(result => {
        this.detailedOrder = result;

        this._snackBar.open('Sikeres mentés!', '', {
          duration: 2000,
          panelClass: ['success'],
        });

      }).catch(e => {

        this._snackBar.open('Hiba történt! ' + e.status,'', {
          duration: 5000,
          panelClass: ['error'],
        })

      });;
    }

    this.ngOnInit();
  }

   /**
   * This function is used for deleting the detailed order. 
   * The user is presented a confirmation dialog and if the user 
   *    decides to go on, then the record is deleted.
   * The user is informed of the succes or error by a snackbar .
   */
  deleteOrder(){

    let dialogData: ConfirmationDialogText = {top: 'Biztosan törli a rendelést?', bottom: ''};

    const dialogRef = this.confDialog.open(ConfdialogComponent, {

      width: '300px',
      data: dialogData,

    }).afterClosed().subscribe(async result => {

      if(result){

        await this.orderService.deleteBusinessOrder(this.detailedOrder.id).then(result => {

          this._snackBar.open('Rendelés sikeresen törölve!','', {
            duration: 2000,
            panelClass: ['success'],

          })

          this.routing.navigate(['/orderList']);

        }).catch(e => {

          this._snackBar.open('Művelet sikertelen!' + e.status,'', {
            duration: 2000,
            panelClass: ['error'],
          })

        });
      }
    })
  }


  async closeOrder(): Promise<void>{
    this.detailedOrder.status = "CLOSED";
    await this.orderService.updateBusinessOrder(this.detailedOrder).then(res => {

      this.detailedOrder = res;

      this._snackBar.open('Sikeresen lezárta a rendelést!','',{
        duration: 2000,
        panelClass: ['success'],
      })

      this.disableForm();

    }).catch(e => {

      this._snackBar.open('Hiba történt! status: ' + e.status,'',{
        duration: 2000,
        panelClass: ['error'],
      })
    });
  }

  disableForm(): void{
    this.partner.disable();
    this.issueDate.disable();
    this.dueDate.disable();
    this.orderDescription.disable();
    this.vat.disable();
    this.paymentType.disable();
  }

  async openOrder(): Promise<void>{
    this.detailedOrder.status = "OPEN";
    await this.orderService.updateBusinessOrder(this.detailedOrder).then(res => {

      this.detailedOrder = res;

      this._snackBar.open('Sikeresen újranyitotta a rendelést!','',{
        duration: 2000,
        panelClass: ['success'],
      })

      this.enableForm();

    }).catch(e => {

      this._snackBar.open('Hiba történt! status: ' + e.status,'',{
        duration: 2000,
        panelClass: ['error'],
      })

    });
  }

  enableForm(): void{
    this.partner.enable();
    this.detailedOrder.issueDate = new Date();
    this.dueDate.enable();
    this.orderDescription.enable();
    this.vat.enable();
    this.paymentType.enable();
  }

  async orderIsPayed(): Promise<void>{
    this.detailedOrder.status = "DONE";

    let dialogData: ConfirmationDialogText = {top: 'Biztosan teljesítettre állítja?', 
                                              bottom: 'Ezután már nem tud rajta módosítani, csak törölni lehetséges!'}
    const dialogRef = this.confDialog.open(ConfdialogComponent, {

      width: '300px',
      data: dialogData,

    }).afterClosed().subscribe(async result => {

      if(result){
        
        await this.orderService.updateBusinessOrder(this.detailedOrder).then(res => {

          this.detailedOrder = res;
      
          this._snackBar.open('A rendelés teljesítve!','',{
            duration: 2000,
            panelClass: ['success'],
          })
      
          this.disableForm();
      
        }).catch(e => {
      
          this._snackBar.open('Hiba történt! status: ' + e.status,'',{
            duration: 2000,
            panelClass: ['error'],
          })
        });
      }
  })

  }

  getAuthService(): AuthorizationService{
    return this.authService;
  }

  /**
   * This function opens the invoice item dialog which we can use to edit, create or delete items.
   * If an item is passed as parameter, then the item is passed to the dialog and the funcion tell the dialog
   *    the item item is not new. If nothing is passed then a newly created item is passed.
   * After dialog termination the component is initiated newly. 
   */
  openItemDialog(orderItem?: OrderItem){

    let dialogData: ItemDialog = {isNew: null, orderId: null, orderItem: null};

    dialogData.orderId = this.detailedOrder.id;

    if(orderItem == null){
      dialogData.isNew = true;
      dialogData.orderItem = new OrderItem();
    }else{
      dialogData.isNew = false;
      dialogData.orderItem = orderItem;
    }

    const dialogRef = this.itemDialog.open(OrderItemDialog, {
      width: '500px',
      data: dialogData
    }).afterClosed().subscribe(result => {

      this.ngOnInit();

    })
  }

  /**
   * This function calculates the order prices on every 
   *    init.
   */
  calculateOrderPrices(){
    this.plusVat = 0;
    this.totalPrice = 0;
    this.netWorth = 0;
    this.orderItems.forEach(invoiceItem => {
      this.totalPrice += (invoiceItem.price * invoiceItem.quantity);
      this.netWorth += (invoiceItem.price * (1 - (this.detailedOrder.vat / 100))) * invoiceItem.quantity;
    })
    this.plusVat = this.totalPrice - (this.totalPrice * (1 - (this.detailedOrder.vat / 100)));
  }

  /**
   * This two function used for generating pdf and previewing or downloading it.
   */
  preViewOrderPdf(){
    let pdfMaker = new PdfGenerator();

    pdfMaker.openOrderPdf(this.detailedOrder,this.orderItems,this.ownCompany);
  }

  downloadOrderPdf(){
    let pdfMaker = new PdfGenerator();

    pdfMaker.downloadOrderPdf(this.detailedOrder,this.orderItems,this.ownCompany);
  }

}


/**
 * Item dialog component for handling the information of the order items.
 * Used for creating, editing and deleting order items.
 */

@Component({
  selector: 'order-item-dialog',
  templateUrl: './order-item-dialog.html',
})
export class OrderItemDialog{

  /**
   * 
   * @param dialogRef used for closing the dialog when finished with transaction
   * @param data the data passed on by the parent component
   * @param formBuilder used for building the form up
   * @param orderService used for inserting an item to the order
   * @param orderItemService used when updating an order item
   * @param confDialog used when deleting an item, confirmation
   * @param _snackBar used for informing the user of the success or error of transaction
   */
  constructor(
    public dialogRef: MatDialogRef<OrderItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ItemDialog,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    public confDialog: MatDialog,
    private _snackBar: MatSnackBar
  ){}

  /**
   * Form control for the item form, validators added here for fields.
   */
  itemForm = this.formBuilder.group({
    'product': new FormControl(this.data.orderItem.product,Validators.required),
    'quantity': new FormControl(this.data.orderItem.quantity, Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]*")])),
    'unit': new FormControl(this.data.orderItem.unit, Validators.required),
    'price': new FormControl(this.data.orderItem.price, Validators.compose([Validators.required,Validators.pattern("[1-9][0-9]*")])),
    'description': new FormControl(this.data.orderItem.description),
  })

  get product() { return this.itemForm.get('product'); }
  get quantity() { return this.itemForm.get('quantity'); }
  get unit() { return this.itemForm.get('unit'); }
  get price() { return this.itemForm.get('price'); }
  get description() { return this.itemForm.get('description'); }

  /**
   * This function is used to create or update the invoice item
   * based on the passed data 'isNew'.
   * 
   * After the creation or update the user is informed on the success or
   * failure of the action by a snackbar.
   */
  async saveItem(): Promise<void>{

    if(this.data.isNew){

      await this.orderService.insertItemToBusinessOrder(this.data.orderId,this.data.orderItem).then(res => {

        this.dialogRef.close();

        this._snackBar.open('Tétel felvéve!', '',{
          duration: 2500,
          panelClass: ['success'],
        })

      }).catch((e) => {

        this._snackBar.open('Művelet nem sikerült :(' + e.status, '',{
          duration: 2500,
          panelClass: ['error'],
        })

      });

    }else{

      await this.orderItemService.updateOrderItem(this.data.orderItem).then(res => {

        this.dialogRef.close();

        this._snackBar.open('Tétel módosítva!', '',{
          duration: 2500,
          panelClass: ['success'],
        })

      }).catch((e) =>{

        this._snackBar.open('Művelet nem sikerült :(' + e.status, '',{
          duration: 2500,
          panelClass: ['error'],
        })

      });
    }

  }

  /**
   * Opening confirmation dialog before deleting item.
   * If user confirms it, then the recod is deleted and the user is informed of
   *    the actions success or failure by a snackbar.
   */
  openConfDialog(){

    let dialogData: ConfirmationDialogText = {top: 'Biztosan törli a tételt?', bottom: ''};

    const dialogRef = this.confDialog.open(ConfdialogComponent,{

      width: '300px',
      data: dialogData,

    }).afterClosed().subscribe(result => {

      if(result){
        this.orderItemService.deleteOrderItem(this.data.orderItem.id).then(result =>{

          this.dialogRef.close();

          this._snackBar.open('Tétel sikeresen törölve!','',{
            duration: 2000,
            panelClass: ['success'],
          });

        }).catch(e => {

          this.dialogRef.close();
          this._snackBar.open('Művelet nem sikerült! ' + e.status,'',{
            duration: 2000,
            panelClass: ['error'],
          });

        });
      }
      
    })
  }
}