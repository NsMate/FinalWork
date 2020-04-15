import { Component, OnInit, ViewChild } from '@angular/core';
import { PartnerService } from 'src/app/services/BusinessServices/Partner/partner.service';
import { Partner } from 'src/app/models/BusinessModels/Partner/partner';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.css']
})
export class PartnerListComponent implements OnInit {

  public partners: Partner[] = [];

  public dataSource;

  constructor(
    private partnerService: PartnerService,
    private routing: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.partners = await this.partnerService.getOutsidePartners();
    this.dataSource = new MatTableDataSource(this.partners);
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'partnerName', 'location', 'contact', 'contactEmail', 'partnershipType'];

  openDetailedPartnerPage(id?: number): void{
    
    if(id != null){

      this.routing.navigate(["/partnerForm"],{queryParams: {new: 'no', id: id}});

    }else{

      this.routing.navigate(["/partnerForm"],{queryParams: {new: 'yes'}});

    }
  }

}
