import { Invoice } from '../models/BusinessModels/Invoice/invoice';
import { InvoiceItem } from '../models/BusinessModels/InvoiceItem/invoice-item';
import { Partner } from '../models/BusinessModels/Partner/partner';
import { OnInit } from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { OrderItem } from '../models/BusinessModels/OrderItem/order-item';
import { BusinessOrder } from '../models/BusinessModels/BusinessOrder/business-order';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class PdfGenerator implements OnInit{

    public totalPrice: number;
    public plusVat: number;
    public netWorth: number;

    constructor(){
    }

    ngOnInit(): void {

    }

    calculatePrices(invoiceOrOrder, items){
        this.plusVat = 0;
        this.totalPrice = 0;
        this.netWorth = 0;
        items.forEach(invoiceItem => {
          this.totalPrice += (invoiceItem.price * invoiceItem.quantity);
          this.netWorth += (invoiceItem.price * (1 - (invoiceOrOrder.vat / 100))) * invoiceItem.quantity;
        })
        this.plusVat = this.totalPrice - (this.totalPrice * (1 - (invoiceOrOrder.vat / 100)));
    }

    openInvoicePdf(invoice: Invoice, invoiceItems: InvoiceItem[], ownCompany: Partner){
        const document = this.generateInvoicePdf(invoice,invoiceItems,ownCompany);

        pdfMake.createPdf(document).open();
    }

    downloadInvoicePdf(invoice: Invoice, invoiceItems: InvoiceItem[], ownCompany: Partner){
        const document = this.generateInvoicePdf(invoice,invoiceItems,ownCompany);

        pdfMake.createPdf(document).download(invoice.partner.partnerName + invoice.id);
    }

    openOrderPdf(order: BusinessOrder, orderItems: OrderItem[], ownCompany: Partner){
      const document = this.generateOrderPdf(order,orderItems,ownCompany);

      pdfMake.createPdf(document).open();

    }

    downloadOrderPdf(order: BusinessOrder, orderItems: OrderItem[], ownCompany: Partner){
      const document = this.generateOrderPdf(order,orderItems,ownCompany);

      pdfMake.createPdf(document).download(order.partner.partnerName + order.id);
    }



  generateInvoicePdf(detailedInvoice: Invoice, invoiceItems: InvoiceItem[], ownCompany: Partner){

        this.calculatePrices(detailedInvoice,invoiceItems);

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
                  text: ownCompany.partnerName,
                  margin: [0,0,0,4],
                  alignment: 'right',
                  fontSize: 10,                  
                  bold: true,
                },
                {
                  text: ownCompany.zipCode.toString() + " " + ownCompany.city,
                  margin: [0,0,0,4],
                  alignment: 'right',
                  fontSize: 10,
                },
                {
                  text: ownCompany.street + " " + ownCompany.streetNumber,
                  margin: [0,0,0,4],
                  alignment: 'right',
                  fontSize: 10,
                },
                {
                  text: 'Adószám: ' + ownCompany.vatNumber,
                  margin: [0,0,0,4],
                  alignment: 'right',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'EU Adószám: HU' + ownCompany.vatNumber.substr(0,8),
                  alignment: 'right',
                  fontSize: 10,
                  bold: true,
                  margin: [0,0,0,4],
                },
                {
                  text: 'Tel.: ' + ownCompany.contactPhoneNumber,
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
                  text: detailedInvoice.partner.partnerName,
                  margin: [0,0,0,4],
                  alignment: 'left',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: detailedInvoice.partner.zipCode.toString() + " " + detailedInvoice.partner.city,
                  margin: [0,0,0,4],
                  alignment: 'left',
                  fontSize: 10,
                },
                {
                  text: detailedInvoice.partner.street + " " + detailedInvoice.partner.streetNumber,
                  margin: [0,0,0,4],
                  alignment: 'left',
                  fontSize: 10,
                },
                {
                  text: 'Adószám: ' + detailedInvoice.partner.vatNumber,
                  alignment: 'left',
                  fontSize: 10,
                }],
                [
                  {
                    text: 'Azonosító: No. ' + detailedInvoice.id,
                    alignment: 'right',
                    bold: true,
                    margin: [0,18,0,12],
                    fontSize: 10,
                  },
                  {
                    text: 'Létrehozva: ' + detailedInvoice.issueDate.toLocaleString(),
                    alignment: 'right',
                    margin: [0,0,0,12],
                    decoration: 'underline',
                    fontSize: 10,
                  },
                  {
                    text: 'Fizetési határidő: ' + detailedInvoice.dueDate.toLocaleString(),
                    alignment: 'right',
                    margin: [0,0,0,12],
                    decoration: 'underline',
                    color: 'red',
                    fontSize: 10,
                  },
                  {
                    text: 'Fizetés módja: ' + detailedInvoice.paymentType,
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
            this.getItemsTable(invoiceItems, detailedInvoice),
            {
              columns:[
                [
                  {
                    text: 'Részösszeg: ' + this.netWorth.toLocaleString('hu',{minimumFractionDigits: 2}) + ' HUF',
                    fontSize: 12,
                    margin: [0,32,0,8],
                    alignment: 'right',
                    bold: true
                  },
                  {
                    text: 'Adó(' + detailedInvoice.vat + ' %): ' + this.plusVat.toLocaleString('hu',{minimumFractionDigits: 2}) + ' HUF',
                    fontSize: 12,
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
                    text: 'Teljes összeg: ' + this.totalPrice.toLocaleString('hu',{minimumFractionDigits: 2}) + ' HUF',
                    fontSize: 12,
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

       getItemsTable(invoiceItems: InvoiceItem[], invoice: Invoice){
        return{
          table: {
            widths: [40,50,85,50,60,60,75],
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
                          (item.price * (1 - (invoice.vat /100))).toLocaleString('hu',{minimumFractionDigits: 2}),
                          (((item.price * (1 - (invoice.vat /100)))) * item.quantity).toLocaleString('hu',{minimumFractionDigits: 2}),
                          ((item.price * item.quantity) 
                            - (( (item.price * (1 - (invoice.vat /100)))) * item.quantity)).toLocaleString('hu',{minimumFractionDigits: 2}),
                          (item.price * item.quantity).toLocaleString('hu',{minimumFractionDigits: 2}) + ' HUF'];
              })
            ],
          },layout: 'lightHorizontalLines', fontSize: 10
        }
      }

      generateOrderPdf(detailedOrder: BusinessOrder, orderItems: OrderItem[], ownCompany: Partner){

        this.calculatePrices(detailedOrder,orderItems);

        const documentDefinition = { 
          content: [
            {
              text: 'Rendelés',
              bold: true,
              fontSize: 20,
              alignment: 'center',
              margin: [0, 0, 0, 20]
            },
            //Kibocsátó szerv adatai jobb oldalt
            {
              columns:[
                [{
                  text: 'Vevő',
                  margin: [0,0,0,10],
                  fontSize: 14,
                  bold: true,
                  decoration: 'underline',
                  alignment: 'right',
                },{
                  text: ownCompany.partnerName,
                  margin: [0,0,0,4],
                  alignment: 'right',
                  fontSize: 10,                  
                  bold: true,
                },
                {
                  text: ownCompany.zipCode.toString() + " " + ownCompany.city,
                  margin: [0,0,0,4],
                  alignment: 'right',
                  fontSize: 10,
                },
                {
                  text: ownCompany.street + " " + ownCompany.streetNumber,
                  margin: [0,0,0,4],
                  alignment: 'right',
                  fontSize: 10,
                },
                {
                  text: 'Adószám: ' + ownCompany.vatNumber,
                  margin: [0,0,0,4],
                  alignment: 'right',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'EU Adószám: HU' + ownCompany.vatNumber.substr(0,8),
                  alignment: 'right',
                  fontSize: 10,
                  bold: true,
                  margin: [0,0,0,4],
                },
                {
                  text: 'Tel.: ' + ownCompany.contactPhoneNumber,
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
                  text: 'Eladó',
                  margin: [0,10,0,10],
                  fontSize: 14,
                  bold: true,
                  decoration: 'underline',
                  alignment: 'left',
                },{
                  text: detailedOrder.partner.partnerName,
                  margin: [0,0,0,4],
                  alignment: 'left',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: detailedOrder.partner.zipCode.toString() + " " + detailedOrder.partner.city,
                  margin: [0,0,0,4],
                  alignment: 'left',
                  fontSize: 10,
                },
                {
                  text: detailedOrder.partner.street + " " + detailedOrder.partner.streetNumber,
                  margin: [0,0,0,4],
                  alignment: 'left',
                  fontSize: 10,
                },
                {
                  text: 'Adószám: ' + detailedOrder.partner.vatNumber,
                  alignment: 'left',
                  fontSize: 10,
                }],
                [
                  {
                    text: 'Azonosító: No. ' + detailedOrder.id,
                    alignment: 'right',
                    bold: true,
                    margin: [0,18,0,12],
                    fontSize: 10,
                  },
                  {
                    text: 'Létrehozva: ' + detailedOrder.issueDate.toLocaleString(),
                    alignment: 'right',
                    margin: [0,0,0,12],
                    decoration: 'underline',
                    fontSize: 10,
                  },
                  {
                    text: 'Fizetési határidő: ' + detailedOrder.dueDate.toLocaleString(),
                    alignment: 'right',
                    margin: [0,0,0,12],
                    decoration: 'underline',
                    color: 'red',
                    fontSize: 10,
                  },
                  {
                    text: 'Fizetés módja: ' + detailedOrder.paymentType,
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
            this.getOrderItemsTable(orderItems, detailedOrder),
            {
              columns:[
                [
                  {
                    text: 'Részösszeg: ' + this.netWorth.toLocaleString('hu',{minimumFractionDigits: 2}) + ' HUF',
                    fontSize: 12,
                    margin: [0,32,0,8],
                    alignment: 'right',
                    bold: true
                  },
                  {
                    text: 'Adó(' + detailedOrder.vat + ' %): ' + this.plusVat.toLocaleString('hu',{minimumFractionDigits: 2}) + ' HUF',
                    fontSize: 12,
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
                    text: 'Teljes összeg: ' + this.totalPrice.toLocaleString('hu',{minimumFractionDigits: 2}) + ' HUF',
                    fontSize: 12,
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

       getOrderItemsTable(orderItems: OrderItem[], order: BusinessOrder){
        return{
          table: {
            widths: [40,50,85,50,60,60,75],
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
              ...orderItems.map(item => {
                return [item.product,
                          item.quantity + " " + item.unit, 
                          item.description,
                          (item.price * (1 - (order.vat /100))).toLocaleString('hu',{minimumFractionDigits: 2}),
                          (((item.price * (1 - (order.vat /100)))) * item.quantity).toLocaleString('hu',{minimumFractionDigits: 2}),
                          ((item.price * item.quantity) 
                            - (( (item.price * (1 - (order.vat /100)))) * item.quantity)).toLocaleString('hu',{minimumFractionDigits: 2}),
                          (item.price * item.quantity).toLocaleString('hu',{minimumFractionDigits: 2}) + ' HUF'];
              })
            ],
          },layout: 'lightHorizontalLines', fontSize: 8
        }
      }
}
