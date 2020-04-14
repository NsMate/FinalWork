import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { InvoiceService } from 'src/app/services/BusinessServices/Invoice/invoice.service';
import { Invoice } from 'src/app/models/BusinessModels/Invoice/invoice';
import { InvoiceItem } from 'src/app/models/BusinessModels/InvoiceItem/invoice-item';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Partner } from 'src/app/models/BusinessModels/Partner/partner';
import { PartnerService } from 'src/app/services/BusinessServices/Partner/partner.service';
import { Observable, from } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoiceItemService } from 'src/app/services/BusinessServices/InvoiceItem/invoice-item.service';
import { ConfdialogComponent } from 'src/app/components/ConfirmationDialog/confdialog/confdialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfGenerator } from 'src/app/PDFGenerator/pdf-generator';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


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

  public detailedInvoice: Invoice = new Invoice();
  private invoiceItems: InvoiceItem[] = [];

  public selectedPartner: Partner = new Partner();
  public ownCompany: Partner = new Partner();

  public dataSource;
  
  public minDate = new Date();

  public totalPrice: number;
  public plusVat: number;
  public totalPriceWithVat: number;

  public filteredPartners: Observable<Partner[]> = null;

  constructor(
    private invoiceService: InvoiceService,
    private formBuilder: FormBuilder,
    private partnerService: PartnerService,
    private itemDialog: MatDialog,
    public confDialog: MatDialog,
    private route: ActivatedRoute,
    private routing: Router,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async params => {
      if(params.new == 'no'){
        this.detailedInvoice = await this.invoiceService.getInvoice(parseInt(sessionStorage.getItem("detailedInvoiceId")));
        this.invoiceItems = await this.invoiceService.getInvoiceItems(parseInt(sessionStorage.getItem("detailedInvoiceId")));
      }
    });

    this.dataSource = new MatTableDataSource(this.invoiceItems);
    this.dataSource.sort = this.sort;

    this.calculateInvoicePrices();

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

  invoiceForm = this.formBuilder.group({
    'partner': new FormControl(this.detailedInvoice.partner, Validators.required),
    'issueDate': new FormControl(this.detailedInvoice.issueDate, Validators.compose([Validators.required])),
    'dueDate': new FormControl(this.detailedInvoice.dueDate, Validators.compose([Validators.required])),
    'invoiceDescription': new FormControl(this.detailedInvoice.invoiceDescription),
    'vat': new FormControl(this.detailedInvoice.vat, Validators.compose([Validators.required])),
    'paymentType': new FormControl(this.detailedInvoice.paymentType, Validators.required),
  })

  get partner() { return this.invoiceForm.get('partner'); }
  get issueDate() { return this.invoiceForm.get('issueDate'); }
  get dueDate() { return this.invoiceForm.get('dueDate'); }
  get invoiceDescription() { return this.invoiceForm.get('invoiceDescription'); }
  get vat() { return this.invoiceForm.get('vat'); }
  get paymentType() { return this.invoiceForm.get('paymentType'); }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['product', 'quantity', 'description', 'price' ,'totalPrice'];

  displayFn(val: Partner) {
    return val ? val.partnerName : val;
  }

  saveInvoice(){
    if(this.detailedInvoice.id == null){
      this.invoiceService.createInvoice(this.detailedInvoice).then(result => {

        this.detailedInvoice = result;
        this.routing.navigate(['.'], { relativeTo: this.route, queryParams: { new: 'no', id: result.id }});

        this._snackBar.open('Sikeresen létrehozta a számlát!','', {
          duration: 2000,
          panelClass: ['success'],
        })

      });

    }else{

      this.invoiceService.updateInvoice(this.detailedInvoice).then(result => {
        this.detailedInvoice = result;

        this._snackBar.open('Sikeres mentés!', '', {
          duration: 2000,
          panelClass: ['success'],
        });

      });
    }

    this.ngOnInit();
  }

  deleteInvoice(){

    const dialogRef = this.confDialog.open(ConfdialogComponent, {
      width: '300px',
    }).afterClosed().subscribe(async result => {

      if(result){

        await this.invoiceService.deleteInvoice(this.detailedInvoice.id).then(result => {
          this._snackBar.open('Számla sikeresen törölve!','', {
            duration: 2000,
            panelClass: ['success'],
          })

          this.routing.navigate(['/invoiceList']);

        }).catch(e => {

          this._snackBar.open('Művelet sikertelen!' + e.error,'', {
            duration: 2000,
            panelClass: ['error'],
          })

        });
      }
    })
  }

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
      width: '500px',
      data: dialogData
    }).afterClosed().subscribe(result => {
      this.ngOnInit();
    })

  }

  calculateInvoicePrices(){

    this.plusVat = 0;
    this.totalPrice = 0;
    this.totalPriceWithVat = 0;

    this.invoiceItems.forEach(invoiceItem => {
      this.totalPrice += (invoiceItem.price * invoiceItem.quantity);
    })

    this.plusVat = this.totalPrice * (this.detailedInvoice.vat / 100);
    this.totalPriceWithVat = this.totalPrice + this.plusVat;
    this.plusVat = Math.round(this.plusVat);
  }

  preViewInvoicePdf(){
    let pdfMaker = new PdfGenerator(this.detailedInvoice,this.invoiceItems,this.ownCompany);
    pdfMaker.openInvoicePdf();
  }

  downloadInvoicePdf(){
    let pdfMaker = new PdfGenerator(this.detailedInvoice,this.invoiceItems,this.ownCompany);
    pdfMaker.downloadInvoicePdf();
  }

}

@Component({
  selector: 'invoice-item-dialog',
  templateUrl: './invoice-item-dialog.html',
})
export class InvoiceItemDialog{

  constructor(
    public dialogRef: MatDialogRef<InvoiceItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ItemDialog,
    private formBuilder: FormBuilder,
    private invoiceService: InvoiceService,
    private invoiceItemService: InvoiceItemService,
    public confDialog: MatDialog,
    private _snackBar: MatSnackBar
  ){}

  itemForm = this.formBuilder.group({
    'product': new FormControl(this.data.invoiceItem.product,Validators.required),
    'quantity': new FormControl(this.data.invoiceItem.quantity, Validators.required),
    'unit': new FormControl(this.data.invoiceItem.unit, Validators.required),
    'price': new FormControl(this.data.invoiceItem.price, Validators.required),
    'description': new FormControl(this.data.invoiceItem.description)
  })

  async saveItem(): Promise<void>{

    if(this.data.isNew){

      await this.invoiceService.insertItemToInvoice(this.data.invoiceId,this.data.invoiceItem).then(res => {

        this.dialogRef.close();
        this._snackBar.open('Tétel felvéve!', '',{
          duration: 2500,
          panelClass: ['success'],
        })

      }).catch((e) => {

        this._snackBar.open('Művelet nem sikerült :(' + e, '',{
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

        this._snackBar.open('Művelet nem sikerült :(' + e, '',{
          duration: 2500,
          panelClass: ['error'],
        })

      });
    }

  }

  openConfDialog(){

    const dialogRef = this.confDialog.open(ConfdialogComponent,{
      width: '300px',
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
          this._snackBar.open('Művelet nem sikerült! ' + e,'',{
            duration: 2000,
            panelClass: ['error'],
          });

        });
      }
      
    })
  }
}