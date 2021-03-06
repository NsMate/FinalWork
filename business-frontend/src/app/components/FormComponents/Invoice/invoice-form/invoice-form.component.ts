import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { InvoiceService } from 'src/app/services/BusinessServices/Invoice/invoice.service';
import { Invoice } from 'src/app/models/BusinessModels/Invoice/invoice';
import { InvoiceItem } from 'src/app/models/BusinessModels/InvoiceItem/invoice-item';
import { FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Partner } from 'src/app/models/BusinessModels/Partner/partner';
import { PartnerService } from 'src/app/services/BusinessServices/Partner/partner.service';
import { Observable, from } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoiceItemService } from 'src/app/services/BusinessServices/InvoiceItem/invoice-item.service';
import { ConfdialogComponent, ConfirmationDialogText } from 'src/app/components/ConfirmationDialog/confdialog/confdialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfGenerator } from 'src/app/PDFGenerator/pdf-generator';
import { AuthorizationService } from 'src/app/services/authorization-service.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * This interface carries data to the item dialog for the invoice.
 */

export interface ItemDialog{
  isNew: boolean,
  invoiceId: number,
  invoiceItem: InvoiceItem,
}

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {

  /**
   * detailedInvoice hold the invoice discussed on the form
   * invoiceItems hold the items of detailedInvoice
   */

  public detailedInvoice: Invoice = new Invoice();
  private invoiceItems: InvoiceItem[] = [];

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

  public fontSize: string = 'x-large';

  /**
   * 
   * @param invoiceService used for invoice db operations
   * @param formBuilder used to build up the invoice form
   * @param partnerService used to get the partners from the database
   * @param itemDialog dialog for adding items to the invoice
   * @param confDialog dialog for the confirmation of deleting the invoice
   * @param route used for getting the query string paramters
   * @param routing used for navigating to another page
   * @param _snackBar used to give feedback to the user about his/her actions
   * @param authService used for checking the role of the user
   */
  constructor(
    private invoiceService: InvoiceService,
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
   * detailed invoice is loaded in by query parameters
   * invoice items loaded in by query parameters
   * sort added to table, calculating prices
   * and watching the partner field for changes =>
   *    if change get partners from db by value
   */
  async ngOnInit(): Promise<void> {

    if(this.authService.fontSize == 'large'){
      var sheet = document.createElement('host')
      sheet.innerHTML = "div {border: 2px solid black; background-color: blue;}";
      document.body.appendChild(sheet);
    }

    this.route.queryParams.subscribe(async params => {
      if(params == null){
        this.routing.navigate(['/invoiceForm'],{queryParams: {new: 'yes'}});
      }
      if(params.new == 'yes'){
        this.detailedInvoice = new Invoice();
      }else if(params.new == 'no'){
        try {

          this.detailedInvoice = await this.invoiceService.getInvoice(parseInt(params.id));
          this.invoiceItems = await this.invoiceService.getInvoiceItems(parseInt(params.id));

        } catch (error) {

          this._snackBar.open('Nincs ilyen számla vagy rosszul adta meg az URL-t!','', {
            duration:2000,
            panelClass: ['error'],
          })
          
          this.routing.navigate(['/invoiceForm'],{queryParams: {new: 'yes'}});

        }
      }else{

        this.routing.navigate(['/invoiceForm'],{queryParams: {new: 'yes'}});

      }
      this.dataSource = new MatTableDataSource(this.invoiceItems);
      this.dataSource.sort = this.sort;

      this.calculateInvoicePrices();

      this.date = new Date(this.detailedInvoice.dueDate).getTime() < new Date(this.detailedInvoice.issueDate).getTime();

      this.minDate = new Date(this.detailedInvoice.issueDate);

      if(this.detailedInvoice.status == 'CLOSED' || this.detailedInvoice.status == 'DONE'){
        this.disableForm();
      }
    });
    
    this.invoiceForm.get('partner').valueChanges.subscribe(
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
  invoiceForm = this.formBuilder.group({
    'partner': new FormControl(this.detailedInvoice.partner, 
                                Validators.compose([
                                Validators.required,
                                this.validatePartner,
                                ])),
    'issueDate': new FormControl(this.detailedInvoice.issueDate, Validators.compose([
                                Validators.required])),
    'dueDate': new FormControl(this.detailedInvoice.dueDate, Validators.compose([
                                Validators.required])),
    'invoiceDescription': new FormControl(this.detailedInvoice.invoiceDescription,
                                Validators.maxLength(100)),
    'vat': new FormControl(this.detailedInvoice.vat, Validators.compose([
                                Validators.required,
                                Validators.pattern("[1-9][0-9]*"),
                                Validators.maxLength(2)])),
    'paymentType': new FormControl(this.detailedInvoice.paymentType, 
                                Validators.required),
  })

  get partner() { return this.invoiceForm.get('partner'); }
  get issueDate() { return this.invoiceForm.get('issueDate'); }
  get dueDate() { return this.invoiceForm.get('dueDate'); }
  get invoiceDescription() { return this.invoiceForm.get('invoiceDescription'); }
  get vat() { return this.invoiceForm.get('vat'); }
  get paymentType() { return this.invoiceForm.get('paymentType'); }

  /**
   * This function is used for comparing the partners when loading in an invoice
   *    so the autocomplete can display the correct value from the database
   */
  displayFn(val: Partner) {
    return val ? val.partnerName : val;
  }

  validatePartner(control: AbstractControl){
    if(control.value == null){
      return {noPartner: true};
    }
    if(control.value.id != null){
      return null;
    }else{
      return {noPartner: true};
    }
  }

  /**
   * This function is used to create or update the detailed invoice
   * based on if the invoice is null.
   * 
   * After the creation or update the user is informed on the success or
   * failure of the action by a snackbar.
   */
  saveInvoice(){
    if(this.detailedInvoice.id == null){
      this.invoiceService.createInvoice(this.detailedInvoice).then(result => {

        this.detailedInvoice = result;
        this.routing.navigate(['.'], { relativeTo: this.route, queryParams: { new: 'no', id: result.id }});

        this._snackBar.open('Sikeresen létrehozta a számlát!','', {
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

      this.invoiceService.updateInvoice(this.detailedInvoice).then(result => {
        this.detailedInvoice = result;

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
   * This function is used for deleting the detailed invoice. 
   * The user is presented a confirmation dialog and if the user 
   *    decides to go on, then the record is deleted.
   * The user is informed of the succes or error by a snackbar .
   */
  deleteInvoice(){
    let dialogData: ConfirmationDialogText = {top: 'Biztosan törölné a számlát?', bottom: ''};

    const dialogRef = this.confDialog.open(ConfdialogComponent, {

      width: '300px',
      data: dialogData,

    }).afterClosed().subscribe(async result => {

      if(result){

        await this.invoiceService.deleteInvoice(this.detailedInvoice.id).then(result => {
          this._snackBar.open('Számla sikeresen törölve!','', {
            duration: 2000,
            panelClass: ['success'],
          })

          this.routing.navigate(['/invoiceList']);

        }).catch(e => {

          this._snackBar.open('Művelet sikertelen!' + e.status,'', {
            duration: 2000,
            panelClass: ['error'],
          })

        });
      }
    })
  }


  async closeInvoice(): Promise<void>{
    this.detailedInvoice.status = "CLOSED";
    await this.invoiceService.updateInvoice(this.detailedInvoice).then(res => {

      this.detailedInvoice = res;

      this._snackBar.open('Sikeresen lezárta a számlát!','',{
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
    this.invoiceDescription.disable();
    this.vat.disable();
    this.paymentType.disable();
  }

  async openInvoice(): Promise<void>{
    this.detailedInvoice.status = "OPEN";
    await this.invoiceService.updateInvoice(this.detailedInvoice).then(res => {

      this.detailedInvoice = res;

      this._snackBar.open('Sikeresen újranyitotta a számlát!','',{
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
    this.detailedInvoice.issueDate = new Date();
    this.dueDate.enable();
    this.detailedInvoice.dueDate = new Date();
    this.invoiceDescription.enable();
    this.vat.enable();
    this.paymentType.enable();
  }

  async invoiceIsPayed(): Promise<void>{

    let dialogData: ConfirmationDialogText = {top: 'Biztosan teljesítettre állítja?', 
                                              bottom: 'Ezután már nem tud rajta módosítani, csak törölni lehetséges!'}
    const dialogRef = this.confDialog.open(ConfdialogComponent, {

      width: '300px',
      data: dialogData,

    }).afterClosed().subscribe(async result => {

      if(result){
        this.detailedInvoice.status = "DONE";

        await this.invoiceService.updateInvoice(this.detailedInvoice).then(res => {

          this.detailedInvoice = res;
    
          this._snackBar.open('A számla teljesítve!','',{
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
  openItemDialog(invoiceItem?: InvoiceItem){

    let dialogData: ItemDialog = {isNew: null, invoiceId: null, invoiceItem: null};
    dialogData.invoiceId = this.detailedInvoice.id;

    if(invoiceItem == null){
      dialogData.isNew = true;
      dialogData.invoiceItem = new InvoiceItem();
    }else{
      dialogData.isNew = false;
      dialogData.invoiceItem = invoiceItem;
    }

    const dialogRef = this.itemDialog.open(InvoiceItemDialog, {
      width: '650px',
      data: dialogData
    }).afterClosed().subscribe(result => {

      this.ngOnInit();

    })
  }

  /**
   * This function calculates the invoice prices on every 
   *    init.
   */
  calculateInvoicePrices(){
    this.plusVat = 0;
    this.totalPrice = 0;
    this.netWorth = 0;
    this.invoiceItems.forEach(invoiceItem => {
      this.totalPrice += (invoiceItem.price * invoiceItem.quantity);
      this.netWorth += (invoiceItem.price * (1 - (this.detailedInvoice.vat / 100))) * invoiceItem.quantity;
    })
    this.plusVat = this.totalPrice - (this.totalPrice * (1 - (this.detailedInvoice.vat / 100)));
  }

  /**
   * This two function used for generating pdf and previewing or downloading it.
   */
  preViewInvoicePdf(){
    let pdfMaker = new PdfGenerator();
    pdfMaker.openInvoicePdf(this.detailedInvoice,this.invoiceItems,this.ownCompany);
  }

  downloadInvoicePdf(){
    let pdfMaker = new PdfGenerator();
    pdfMaker.downloadInvoicePdf(this.detailedInvoice,this.invoiceItems,this.ownCompany);
  }

}

/**
 * Item dialog component for handling the information of the invoice items.
 * Used for creating, editing and deleting invoice items.
 */

@Component({
  selector: 'invoice-item-dialog',
  templateUrl: './invoice-item-dialog.html',
})
export class InvoiceItemDialog{

  /**
   * 
   * @param dialogRef used for closing the dialog when finished with transaction
   * @param data the data passed on by the parent component
   * @param formBuilder used for building the form up
   * @param invoiceService used for inserting an item to the invoice
   * @param invoiceItemService used when updating an invoice item
   * @param confDialog used when deleting an item, confirmation
   * @param _snackBar used for informing the user of the success or error of transaction
   */
  constructor(
    public dialogRef: MatDialogRef<InvoiceItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ItemDialog,
    private formBuilder: FormBuilder,
    private invoiceService: InvoiceService,
    private invoiceItemService: InvoiceItemService,
    public confDialog: MatDialog,
    private _snackBar: MatSnackBar
  ){}

  /**
   * Form control for the item form, validators added here for fields.
   */
  itemForm = this.formBuilder.group({
    'product': new FormControl(this.data.invoiceItem.product,Validators.compose([
                                  Validators.required,
                                  Validators.pattern("[A-ZŰÁÉÚŐÓÜÖ]+[A-Za-zűáéúőóüöŰÁÉÚŐÓÜÖ \-\.1-9]*"),
                                  Validators.maxLength(30)])),
    'quantity': new FormControl(this.data.invoiceItem.quantity, Validators.compose([
                                  Validators.required, 
                                  Validators.pattern("[1-9][0-9]*"),
                                  Validators.maxLength(7)])),
    'unit': new FormControl(this.data.invoiceItem.unit,Validators.compose([ 
                                  Validators.required,
                                  Validators.maxLength(10)])),
    'price': new FormControl(this.data.invoiceItem.price, Validators.compose([
                                  Validators.required,
                                  Validators.pattern("[1-9][0-9]*"),
                                  Validators.maxLength(7)])),
    'description': new FormControl(this.data.invoiceItem.description,
                                  Validators.maxLength(50)),
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

      await this.invoiceService.insertItemToInvoice(this.data.invoiceId,this.data.invoiceItem).then(res => {

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

      await this.invoiceItemService.updateInvoiceItem(this.data.invoiceItem).then(res => {

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
        this.invoiceItemService.deleteInvoiceItem(this.data.invoiceItem.id).then(result =>{

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