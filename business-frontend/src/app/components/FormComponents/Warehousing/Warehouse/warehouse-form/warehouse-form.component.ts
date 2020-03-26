import { Component, OnInit } from '@angular/core';
import { WarehouseService } from 'src/app/services/Warehousing/Warehouse/warehouse.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.css']
})
export class WarehouseFormComponent implements OnInit {

  constructor(
    private warehouseService: WarehouseService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  warehouseForm = this.formBuilder.group({
    'zip': new FormControl('2660', Validators.required),
    'city': new FormControl('Bgy', Validators.required),
    'street': new FormControl('Móricz', Validators.required),
    'streeNumber': new FormControl('', Validators.required)
  })

  get zip() { return this.warehouseForm.get('zip'); }
  get city() { return this.warehouseForm.get('city'); }
  get street() { return this.warehouseForm.get('street'); }
  get streeNumber() { return this.warehouseForm.get('streeNumber'); }
}
