import { Invoice } from '../models/BusinessModels/Invoice/invoice';
import { InvoiceItem } from '../models/BusinessModels/InvoiceItem/invoice-item';
import { Partner } from '../models/BusinessModels/Partner/partner';
import { OnInit } from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class PdfGenerator implements OnInit{

    private detailedInvoice: Invoice = null;
    private invoiceItems: InvoiceItem[] = [];
    private ownCompany: Partner = null;

    public totalPrice: number;
    public plusVat: number;
    public netWorth: number;

    constructor(
        detailedInvoice: Invoice,
        invoiceItems: InvoiceItem[],
        ownCompany: Partner
    ){
        this.detailedInvoice = detailedInvoice;
        this.invoiceItems = invoiceItems;
        this.ownCompany = ownCompany;
    }

    ngOnInit(): void {

    }

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

    openInvoicePdf(){
        const document = this.generatePdf();
        pdfMake.createPdf(document).open();
    }

    downloadInvoicePdf(){
        const document = this.generatePdf();

        pdfMake.createPdf(document).download(this.detailedInvoice.partner.partnerName + this.detailedInvoice.id);
    }

    generatePdf(){

        this.calculateInvoicePrices();

        const documentDefinition = { 
          content: [
            {
              text: 'Számla',
              bold: true,
              fontSize: 20,
              alignment: 'center',
              margin: [0, 0, 0, 20]
            },
            //Kibocsátó szerv adatai jobb oldalt
            {
              columns:[
                [{
                  text: 'Kibocsátó',
                  margin: [0,0,0,10],
                  fontSize: 14,
                  bold: true,
                  decoration: 'underline',
                  alignment: 'right',
                },{
                  text: this.ownCompany.partnerName,
                  margin: [0,0,0,4],
                  alignment: 'right',
                  fontSize: 10,                  
                  bold: true,
                },
                {
                  text: this.ownCompany.zipCode.toString() + " " + this.ownCompany.city,
                  margin: [0,0,0,4],
                  alignment: 'right',
                  fontSize: 10,
                },
                {
                  text: this.ownCompany.street + " " + this.ownCompany.streetNumber,
                  margin: [0,0,0,4],
                  alignment: 'right',
                  fontSize: 10,
                },
                {
                  text: 'Adószám: ' + this.ownCompany.vatNumber,
                  margin: [0,0,0,4],
                  alignment: 'right',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'EU Adószám: HU' + this.ownCompany.vatNumber.substr(0,8),
                  alignment: 'right',
                  fontSize: 10,
                  bold: true,
                  margin: [0,0,0,4],
                },
                {
                  text: 'Tel.: ' + this.ownCompany.contactPhoneNumber,
                  alignment: 'right',
                  bold: true,
                  fontSize: 10,
                }]
              ]
            },
            //Elválasztó vonal
            {
              canvas:[
                {
                  type: 'line',
                  x1: 0, y1: 10,
                  x2: 520, y2: 10,
                  lineWidth: 1
                }
              ]
            },
            //Vevő adatai bal oldalt, számla dátumai jobb oldalt
            {
              columns:[
                [{
                  text: 'Vevő',
                  margin: [0,10,0,10],
                  fontSize: 14,
                  bold: true,
                  decoration: 'underline',
                  alignment: 'left',
                },{
                  text: this.detailedInvoice.partner.partnerName,
                  margin: [0,0,0,4],
                  alignment: 'left',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: this.detailedInvoice.partner.zipCode.toString() + " " + this.detailedInvoice.partner.city,
                  margin: [0,0,0,4],
                  alignment: 'left',
                  fontSize: 10,
                },
                {
                  text: this.detailedInvoice.partner.street + " " + this.detailedInvoice.partner.streetNumber,
                  margin: [0,0,0,4],
                  alignment: 'left',
                  fontSize: 10,
                },
                {
                  text: 'Adószám: ' + this.detailedInvoice.partner.vatNumber,
                  alignment: 'left',
                  fontSize: 10,
                }],
                [
                  {
                    text: 'Azonosító: No. ' + this.detailedInvoice.id,
                    alignment: 'right',
                    bold: true,
                    margin: [0,18,0,12],
                    fontSize: 10,
                  },
                  {
                    text: 'Létrehozva: ' + this.detailedInvoice.issueDate.toLocaleString(),
                    alignment: 'right',
                    margin: [0,0,0,12],
                    decoration: 'underline',
                    fontSize: 10,
                  },
                  {
                    text: 'Fizetési határidő: ' + this.detailedInvoice.dueDate.toLocaleString(),
                    alignment: 'right',
                    margin: [0,0,0,12],
                    decoration: 'underline',
                    color: 'red',
                    fontSize: 10,
                  },
                  {
                    text: 'Fizetés módja: ' + this.detailedInvoice.paymentType,
                    alignment: 'right',
                    margin: [0,0,0,0],
                    fontSize: 10,
                  }
                ]
              ]
            },
            //Elválasztó vonal
            {
              canvas:[
                {
                  type: 'line',
                  x1: 0, y1: 10,
                  x2: 520, y2: 10,
                  lineWidth: 1
                }
              ]
            },
            //Tételek header
            {
              text: 'Tételek:',
              bold: true,
              fontSize: 16,
              margin: [0,18,0,18]
            },
            //Tételek táblázat
            this.getItemsTable(this.invoiceItems),
            {
              columns:[
                [
                  {
                    text: 'Részösszeg: ' + this.netWorth.toFixed(2) + ' HUF',
                    fontSize: 14,
                    margin: [0,32,0,8],
                    alignment: 'right',
                    bold: true
                  },
                  {
                    text: 'Adó(' + this.detailedInvoice.vat + ' %): ' + this.plusVat.toFixed(2) + ' HUF',
                    fontSize: 14,
                    margin: [0,0,0,0],
                    alignment: 'right',
                    color: 'red',
                    bold: true
                  },
                  {
                    canvas:[
                      {
                        type: 'line',
                        x1: 350, y1: 10,
                        x2: 520, y2: 10,
                        lineWidth: 1
                      }
                    ]
                  },
                  {
                    text: 'Teljes összeg: ' + this.totalPrice.toFixed(2) + ' HUF',
                    fontSize: 14,
                    margin: [0,16,0,8],
                    alignment: 'right',
                    decoration: 'underline',
                    color: 'green',
                    bold: true
                  }
                ]
              ]
            },
          ]
        };
        
        return documentDefinition;
       }

       getItemsTable(invoiceItems: InvoiceItem[]){
        return{
          table: {
            widths: [50,50,85,50,50,50,75],
            body: [
              [
                {
                  text: 'Tétel',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Mennyiség',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Részletek',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Egységár',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Nettó érték',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'ÁFA',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Teljes ár',
                  bold: true,
                  fontSize: 10,
                },
              ],
              ...invoiceItems.map(item => {
                return [item.product,
                          item.quantity + " " + item.unit, 
                          item.description,
                          (item.price * (1 - (this.detailedInvoice.vat /100))).toFixed(2),
                          (((item.price * (1 - (this.detailedInvoice.vat /100)))) * item.quantity).toFixed(2),
                          ((item.price * item.quantity) 
                            - (( (item.price * (1 - (this.detailedInvoice.vat /100)))) * item.quantity)).toFixed(2),
                          (item.price * item.quantity).toFixed(2) + ' HUF'];
              })
            ],
          },layout: 'lightHorizontalLines', fontSize: 10
        }
      }
}
